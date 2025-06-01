import { gql } from '@apollo/client';

// GraphQL query to fetch activity rankings
export const GET_ACTIVITY_RANKINGS = gql`
  query CityActivityRankings($city: String!, $activities: [String]) {
    cityActivityRankings(city: $city, activities: $activities) {
      activity
      score
    }
  }
`;