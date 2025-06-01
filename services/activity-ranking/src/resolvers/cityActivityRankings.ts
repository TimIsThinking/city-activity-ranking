import { getCityGeocode, getWeatherForecast } from "../services/mateoService.js";

type Criteria = {
  city: String
  activities: [String]
}

const initialActivities = [{
  name: "Skiing",
  initialScore: 0,
 },
 {
  name: "Surfing",
  initialScore: 0,
 },
 {
  name: "Outdoor sightseeing",
  initialScore: 0,
 },
 {
  // Indoor sightseeing is applicable in all weather, so we start with mid-range score
  name: "Indoor sightseeing",
  initialScore: 3.5,
 }];

const activityRankingMethod = {
  "Skiing": (day: any) => (day.tempMax < 0 && day.snowfall > 0) ? 1 : 0,
  "Surfing": (day: any) => (day.windSpeed > 5 && day.windSpeed < 15) ? 1 : 0,
  "Outdoor sightseeing": (day: any) => (day.tempMin > 10 && day.tempMax < 25 && day.rainSum < 1) ? 1 : 0,
  // Only add 0.5 for indoor sightseeing as a bonus if conditions are not ideal for outdoor activities as we already start with a mid-range score
  "Indoor sightseeing": (day: any) => (day.rainSum > 5 || day.tempMax > 30 || day.tempMin < 0) ? 0.5 : 0,
}

const computeActivityScore = ({activity, dailyWeatherData, initialScore = 0}) => {
  let score = initialScore;

  dailyWeatherData.time.forEach((_, index) => {
    const day = {
      tempMax: dailyWeatherData.temperature2mMax[index],
      tempMin: dailyWeatherData.temperature2mMin[index],
      rainSum: dailyWeatherData.rainSum[index],
      snowfall: dailyWeatherData.snowfallSum[index],
      windSpeed: dailyWeatherData.windSpeed10mMax[index],
    };

    score += activityRankingMethod[activity](day)
  });

  // // Cap indoorSightseeing at 7 to keep scores consistent
  // rankings.indoorSightseeing = Math.min(Math.floor(rankings.indoorSightseeing), 7);

  return score;
}

export const cityActivityRankingsResolver =  async (_: any, { city, activities }: Criteria)=> {
  // Get the geocode for the requested city
  const { latitude, longitude } = await getCityGeocode({ city });
  
  // Obtain the daily weather data for the next 7 days
  const dailyWeatherData = await getWeatherForecast({ latitude, longitude });
  
  // For each activity, compute a score based on the weather data
  const activityRankings = activities.map(activity => {
    const initialActvitiy = initialActivities.find(x => x.name === activity);
    if (!initialActvitiy) return
    
    const score = computeActivityScore({
      activity: initialActvitiy.name,
      dailyWeatherData: dailyWeatherData.daily,
      initialScore: initialActvitiy.initialScore
    });

    return {
      activity,
      score
    }
  })
  
  return activityRankings;
}