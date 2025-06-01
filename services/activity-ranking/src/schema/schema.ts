export const typeDefs = `#graphql
  type ActivityRanking {
    activity: String
    score: Float
  }

  input CityActivityRankingsInput {
    city: String!
    activities: [String]
  }

  type Query {
    cityActivityRankings(city: String!, activities: [String]): [ActivityRanking]
  }
`;