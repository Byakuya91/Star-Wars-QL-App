// TODO: Define the blueprint and schemas for SWAPI data
// !1 Need to define mutations but what matters is displaying the mock data first and foremost(WORKING)

const { gql } = require("apollo-server");

// Defining typeDef to structure the data
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
    #! IMPORTANT: need to code out the delete and update FIRST
    deleteCharacter(id: ID!): Character
    updateCharacter(
      id: ID!
      name: String
      species: String
      homeworld: String
    ): Character
  }
`;

//   Exporting the data

module.exports = typeDefs;
