// ?Third party imports
const { ApolloServer, gql } = require("apollo-server");

// ?File imports
const typeDefs = require("./Schemas/characterSchema");
const resolvers = require("./resolvers/resolvers.js");

// TODO list:
// 1) Setup the server using Apollo server and test it(DONE).
// 2) Create the mock data(DONE).
// 3) Create and define Schemas(DONE).
// 4) Test the server by making some GraphQL calls(DONE).
// 5) Setup resolvers and get them to work(DONE).
// 6) Figure out the CRUD operations and mutations(DONE).
// 7) Test the resolvers and mutations with the mock data(DONE).
// 8) Integrate the SWAPI data into the server(ONGOING).
// 9) Connect the server to the client/ front-end of the application and correct for bugs.

// ! PROBLEM: You have set up an Apollo Server for a Star Wars character application with mock data, but new entries added via the front-end were not persisted between server restarts. Initially, your backend data was stored in-memory, causing the data to be lost when the server restarted. You need to integrate a persistent storage solution, like MongoDB, to ensure that the data remains available across server sessions.
// TODO: Implement MongoDB server
// 1) install the Mongoose package(ONGOING)
// 2) Setup MongoDB connection locally(ONGOING)
// 3) Define Mongoose Model
// 4) Update the resolvers
// 5) Remove the mock data and test the server.
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
