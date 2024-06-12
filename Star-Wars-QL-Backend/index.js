// ?Third party imports
const { ApolloServer, gql } = require("apollo-server");

// ?File imports
const typeDefs = require("./Schemas/characterSchema");
const resolvers = require("./resolvers/resolvers.js");

// TODO list:
// 1) Setup the server using Apollo server and test it(ONGOING).
// 2) Create the mock data(ONGOING).
// 3) Create and define Schemas(ONGOING).
// 4) Test the server by making some GraphQL calls.
// 5) Setup resolvers and get them to work.
// 6) Figure out the CRUD operations and mutations.
// 7) Test the resolvers and mutations with the mock data.
// 8) Integrate the SWAPI data into the server.
// 9) Connect the server to the client/ front-end of the application and correct for bugs.

//STEP ONE:  Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: () => ({
  //   // Add any context if necessary
  // }),
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
