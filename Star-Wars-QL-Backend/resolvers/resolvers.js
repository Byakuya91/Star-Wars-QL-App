// TODO: Setup the resolvers to display the data I have(DONE)
// 1) Set up resolver to ADD a Star Wars character name, species and homeworld.(DONE)
// ADDENDUM, Integrate a way to have ids be more naturally generated based on seeded data
// 2) Set up resolver to DELETE a Star Wars character name, species and homeworld.(DONE)
// 3) Set up resolver to EDIT a Star Wars character name, species and homeworld(DONE)

// TODO:
// 1) Modify the backend to handle errors gracefully with Try-catch(DONE)
// 2) Implement a way to test the front-end by having the backend throw errors(DONE)

// ?OTHER FILE IMPORTS
const { v4: uuidv4 } = require("uuid");
const Character = require("../models/Character"); // Import the Character model

// ?! Variable to throw an error for exceptions testing
const simulateError = false; // Set to false when you want to avoid the test.

// Define the resolvers for GraphQL operations
const resolvers = {
  // Define the Query resolvers
  Query: {
    //? Resolver to get all characters
    allPeople: async () => {
      // ?! Testing when the resolver when an error is thrown
      // if (simulateError) throw new Error("Data is unavailable");
      // console.log("The error's boolean is:", simulateError);
      try {
        return await Character.find(); // Fetch all characters from the database
      } catch (error) {
        console.error("Error fetching characters", error);
        throw new Error("Failed to fetch characters");
      }
    },
  },
  // Define the Mutation resolvers
  Mutation: {
    //? Resolver to add a new character
    addCharacter: async (_, { name, species, homeworld }) => {
      // ?! Testing when the resolver when an error is thrown
      // if (simulateError) throw new Error("Intentional error for testing");
      try {
        const newCharacter = new Character({ name, species, homeworld });
        return await newCharacter.save(); // Save the new character to the database
      } catch (error) {
        console.error("Error adding character", error);
        throw new Error("Failed to add character");
      }
    },

    //? Resolver to delete a character by ID
    deleteCharacter: async (_, { id }) => {
      // ?! Testing when the resolver when an error is thrown
      // if (simulateError) throw new Error("Intentional error for testing");
      try {
        const deletedCharacter = await Character.findByIdAndDelete(id); // Delete the character from the database
        if (!deletedCharacter) {
          throw new Error(`Character with id ${id} not found`);
        }
        return deletedCharacter;
      } catch (error) {
        console.error("Error deleting character:", error);
        throw new Error("Failed to delete character");
      }
    },

    // Resolver to update a character by ID
    updateCharacter: async (_, { id, name, species, homeworld }) => {
      // Simulate error
      // if (simulateError) throw new Error("Intentional error for testing");
      try {
        const updatedCharacter = await Character.findById(id); // Find the character by ID

        if (updatedCharacter) {
          if (name !== undefined) updatedCharacter.name = name;
          if (species !== undefined) updatedCharacter.species = species;
          if (homeworld !== undefined) updatedCharacter.homeworld = homeworld;

          return await updatedCharacter.save(); // Save the updated character
        }
        throw new Error(`Character with id ${id} not found`);
      } catch (error) {
        console.error("Error updating character:", error);
        throw new Error("Failed to update character");
      }
    },
  },
};

// Export the resolvers module
module.exports = resolvers;
