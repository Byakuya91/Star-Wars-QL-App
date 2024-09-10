// TODO: Define the blueprint and schemas for SWAPI data
import { gql } from "apollo-server";

// !1 Need to define mutations but what matters is displaying the mock data first and foremost(WORKING)

const typeDefs = gql`
  type Character {
    id: ID!
    name: String!
    species: String
    homeworld: String
  }

  type Query {
    allPeople: [Character]
  }

  type Mutation {
    addCharacter(name: String!, species: String, homeworld: String): Character
    deleteCharacter(id: ID!): Character
    updateCharacter(
      id: ID!
      name: String
      species: String
      homeworld: String
    ): Character
  }
`;

export default typeDefs;
