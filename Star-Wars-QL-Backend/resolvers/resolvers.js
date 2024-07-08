// TODO: Setup the resolvers to display the data I have(DONE)
// 1) Set up resolver to ADD a Star Wars character name, species and homeworld.(DONE)
// ADDENDUM, Integrate a way to have ids be more naturally generated based on seeded data
// 2) Set up resolver to DELETE a Star Wars character name, species and homeworld.(DONE)
// 3) Set up resolver to EDIT a Star Wars character name, species and homeworld(DONE)

// ?OTHER FILE IMPORTS
onst { v4: uuidv4 } = require("uuid");

// Import the array of characters from the data file
const characters = require("../data/characters");

// Define the resolvers for GraphQL operations
const resolvers = {
  // Define the Query resolvers
  Query: {
    // Resolver to get all characters
    allPeople: () => characters,
  },

  // Define the Mutation resolvers
  Mutation: {
    // Resolver to add a new character
    addCharacter: (_, { name, species, homeworld }) => {
      // Create a new character object with a unique ID
      const newCharacter = { id: uuidv4(), name, species, homeworld };

      // Add the new character to the array of characters
      characters.push(newCharacter);

      // Return the new character
      return newCharacter;
    },

    // Resolver to delete a character by ID
    deleteCharacter: (_, { id }) => {
      // Find the index of the character with the given ID
      const characterIndex = characters.findIndex((char) => char.id === id);

      // If the character is found, remove it from the array and return it
      if (characterIndex > -1) {
        const deletedCharacter = characters.splice(characterIndex, 1);
        return deletedCharacter[0];
      }

      // If the character is not found, return null
      return null;
    },

    // Resolver to update a character by ID
    updateCharacter: (_, { id, name, species, homeworld }) => {
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

      // If the character is not found, log an error message and return null
      console.error(`Character with id ${id} not found`);
      return null;
    },
  },
};

// Export the resolvers module
module.exports = resolvers;