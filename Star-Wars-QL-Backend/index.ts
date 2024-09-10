// ?Third party imports
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import dotenv from "dotenv"; // Load environment variables from .env file
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"; // Apollo Playground plugin

// ?File imports
import typeDefs from "./Schemas/characterSchema"; // Importing GraphQL type definitions
import resolvers from "./resolvers/resolvers"; // Importing GraphQL resolvers

// TODO list:
// 1) Setup the server using Apollo server and test it(DONE).
// 2) Create the mock data(DONE).
// 3) Create and define Schemas(DONE).
// 4) Test the server by making some GraphQL calls(DONE).
// 5) Setup resolvers and get them to work(DONE).
// 6) Figure out the CRUD operations and mutations(DONE).
// 7) Test the resolvers and mutations with the mock data(DONE).
// 8) Integrate the SWAPI data into the server(ONGOING).
// 9) Connect the server to the client/front-end of the application and correct for bugs.

// Load environment variables
dotenv.config();

// Define the MongoDB URL from environment variables
const STAR_WARS_URL = process.env.MONGO_DB_URL as string;

if (!STAR_WARS_URL) {
  throw new Error("MONGO_DB_URL environment variable is not defined");
}

// STEP ONE: Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for development
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], // Enable GraphQL Playground
});

// Function to start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(STAR_WARS_URL);
    console.log("MongoDB connected");

    // Start the Apollo Server after MongoDB connection
    const { url } = await server.listen({ port: 4000 });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

// Start the server
startServer();
