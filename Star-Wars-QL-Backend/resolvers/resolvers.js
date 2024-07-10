// TODO: Setup the resolvers to display the data I have(DONE)
// 1) Set up resolver to ADD a Star Wars character name, species and homeworld.(DONE)
// ADDENDUM, Integrate a way to have ids be more naturally generated based on seeded data
// 2) Set up resolver to DELETE a Star Wars character name, species and homeworld.(DONE)
// 3) Set up resolver to EDIT a Star Wars character name, species and homeworld(DONE)

// TODO:
// 1) Modify the backend to handle errors gracefully with Try-catch(DONE)
// 2) Implement a way to test the front-end by having the backend throw errors(ONGOING)

// ?OTHER FILE IMPORTS
const { v4: uuidv4 } = require("uuid");

// Import the array of characters from the data file
const characters = require("../data/characters");

// ?! Variable to throw an error for exceptions testing
const simulateError = false; // Set to false when you want to avoid the test.

// Define the resolvers for GraphQL operations
const resolvers = {
  // Define the Query resolvers
  Query: {
    //? Resolver to get all characters
    allPeople: () => {
      //
      // ?! Testing when  the resolver when an error is thrown
      // if (simulateError) throw new Error("Data is unavailable");
      // console.log("The error's boolean is:", simulateError);
      try {
        return characters;
      } catch (error) {
        console.error("Error fetching characters", error);
        throw new Error("Failed to fetch characters");
      }
    },
  },
  // Define the Mutation resolvers
  Mutation: {
    //? Resolver to add a new character
    addCharacter: (_, { name, species, homeworld }) => {
      // ?! Testing when  the resolver when an error is thrown
      // if (simulateError) throw new Error("Intentional error for testing");
      try {
        // ?STEP ONE: create a new object with an id
        let id;
        do {
          id = uuidv4();
        } while (characters.find((char) => char.id === id));
        //? STEP TWO: create a new object and add it to the array.
        const newCharacter = { id, name, species, homeworld };
        characters.push(newCharacter);
        return newCharacter;
      } catch (error) {
        console.error("Error adding character", error);
        throw new Error("Failed to add character");
      }
    },

    //? Resolver to delete a character by ID
    deleteCharacter: (_, { id }) => {
      // ?! Testing when  the resolver when an error is thrown
      // if (simulateError) throw new Error("Intentional error for testing");
      try {
        // STEP ONE: find the index of the character
        const characterIndex = characters.findIndex((char) => char.id === id);
        // STEP TWO: remove the character from the index
        if (characterIndex > -1) {
          const deleteCharacter = characters.splice(characterIndex, 1);
          return deleteCharacter[0];
        }
        throw new Error(`Character with id ${id} not found`);
      } catch (error) {
        console.error("Error deleting character:", error);
        throw new Error("Failed to delete character");
      }
    },

    // Resolver to update a character by ID
    updateCharacter: (_, { id, name, species, homeworld }) => {
      // Simulate error
      // if (simulateError) throw new Error("Intentional error for testing");
      try {
        // Find the character with the given ID
        const singleCharacter = characters.find((char) => char.id === id);

        // If the character is found, update the fields if they are provided
        if (singleCharacter) {
          if (name !== undefined) singleCharacter.name = name;
          if (species !== undefined) singleCharacter.species = species;
          if (homeworld !== undefined) singleCharacter.homeworld = homeworld;

          // Return the updated character
          return singleCharacter;
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
