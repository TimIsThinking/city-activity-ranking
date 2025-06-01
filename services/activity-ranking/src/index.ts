import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { cityActivityRankingsResolver } from './resolvers/cityActivityRankings.js';
import { typeDefs } from './schema/schema.js';

const resolvers = {
  Query: {
    cityActivityRankings: cityActivityRankingsResolver
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);