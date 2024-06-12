// TODO: Setup the resolvers to display the data I have(DONE)
// 1) Set up resolver to ADD a Star Wars character name, species and homeworld.
// 2) Set up resolver to DELETE a Star Wars character name, species and homeworld.
// 3) Set up resolver to EDIT a Star Wars character name, species and homeworld.

// ?OTHER FILE IMPORTS
const { v4: uuidv4 } = require("uuid");

// ? MOCK DATA IMPORT
const characters = require("../data/characters");

const resolvers = {
  Query: {
    allPeople: () => characters,
  },
  Mutation: {
    //TODO: ADD a new character(full name, species and homeworld)
    // STEP ONE: define the resolver inside the mutation
    addCharacter: (_, { name, species, homeworld }) => {
      // Generate a unique ID for the new character
      const newCharacter = { id: uuidv4(), name, species, homeworld };

      // Add the new character to the characters list
      characters.push(newCharacter);

      // Return the newly added character
      return newCharacter;
    },
  },
};

module.exports = resolvers;
