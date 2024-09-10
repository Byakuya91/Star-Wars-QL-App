import { IResolvers } from "@graphql-tools/utils"; // TypeScript utility for typing resolvers
import Character from "../models/Character"; // Import the Mongoose Character model

// Interface for character input
interface CharacterInput {
  id?: string;
  name: string;
  species?: string;
  homeworld?: string;
}

// GraphQL Resolvers
const resolvers: IResolvers = {
  // Define the Query resolvers
  Query: {
    // Resolver to get all characters
    allPeople: async () => {
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
    // Resolver to add a new character
    addCharacter: async (
      _: undefined,
      { name, species, homeworld }: Omit<CharacterInput, "id">
    ) => {
      try {
        const newCharacter = new Character({ name, species, homeworld });
        return await newCharacter.save(); // Save the new character to the database
      } catch (error) {
        console.error("Error adding character", error);
        throw new Error("Failed to add character");
      }
    },

    // Resolver to delete a character by ID
    deleteCharacter: async (_: undefined, { id }: { id: string }) => {
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
    updateCharacter: async (
      _: undefined,
      { id, name, species, homeworld }: CharacterInput
    ) => {
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

export default resolvers;
