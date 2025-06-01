import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';

import { Location } from '../types/types.js'

// type ErrorMessage = {
//   error: String
// }

const getCityGeocode = async ({ city }: { city: String }): Promise<Location | any> => {
  try {
    const geocodeResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geocodeData = geocodeResponse.data;
    
    // Check if city was found
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return { error: `City "${city}" not found` };
    }

    return geocodeData.results[0];

  } catch (error) {
    // Handle API or network errors
    console.error('Error fetching getCityGeocode:', error.message);
    return { error: 'Failed to fetch geocode data. Please try again later.' };
  }
}

const getWeatherForecast = async ({ latitude, longitude }: Location): Promise<any> => {
  const params = {
    latitude,
    longitude,
    daily: ["temperature_2m_min", "temperature_2m_max", "rain_sum", "snowfall_sum", "wind_speed_10m_max"],
    timezone: "GMT"
  };

  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();

    const daily = response.daily()!;

    const weatherData = {
      daily: {
        time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature2mMin: daily.variables(0)!.valuesArray()!,
        temperature2mMax: daily.variables(1)!.valuesArray()!,
        rainSum: daily.variables(2)!.valuesArray()!,
        snowfallSum: daily.variables(3)!.valuesArray()!,
        windSpeed10mMax: daily.variables(4)!.valuesArray()!,
      },
    };

    return weatherData;
  } catch (error) {
    // Handle API or network errors
    console.error('Error fetching getWeatherForecast:', error.message);
    return { error: 'Failed to fetch weather data. Please try again later.' };
  }
}

export {
  getCityGeocode,
  getWeatherForecast
}