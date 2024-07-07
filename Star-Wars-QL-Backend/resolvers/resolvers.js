// TODO: Setup the resolvers to display the data I have(DONE)
// 1) Set up resolver to ADD a Star Wars character name, species and homeworld.(DONE)
// ADDENDUM, Integrate a way to have ids be more naturally generated based on seeded data
// 2) Set up resolver to DELETE a Star Wars character name, species and homeworld.(DONE)
// 3) Set up resolver to EDIT a Star Wars character name, species and homeworld(DONE)

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

    // ?CODE FOR ADD character
    addCharacter: (_, { name, species, homeworld }) => {
      // Generate a unique ID for the new character
      const newCharacter = { id: uuidv4(), name, species, homeworld };

      // Add the new character to the characters list
      characters.push(newCharacter);

      // Return the newly added character
      return newCharacter;
    },
    // ? CODE for DELETING a character
    deleteCharacter: (_, { id }) => {
      // Find the index of the character to be deleted
      const characterIndex = characters.findIndex((char) => char.id === id);
      // If character found, remove it from the list and return it
      if (characterIndex > -1) {
        const deletedCharacter = characters.splice(characterIndex, 1);
        return deletedCharacter[0];
      }

      // If character not found, return null
      return null;
    },
    //    ?CODE for UPDATING A CHARACTER
    updateCharacter: (_, { id, name, species, homeworld }) => {
      // STEP ONE: find the character
      const singleCharacter = characters.find((char) => char.id === id);

      // STEP TWO: if found, update the information
      if (singleCharacter) {
        singleCharacter.name = name || singleCharacter.name;
        singleCharacter.species = species || singleCharacter.species;
        singleCharacter.homeworld = homeworld || singleCharacter.homeworld;

        // return the character
        return singleCharacter;
      }

      // STEP THREE: if we CANNOT find the character
      return null;
    },
  },
};

module.exports = resolvers;
