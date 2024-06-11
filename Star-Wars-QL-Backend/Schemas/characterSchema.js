// TODO: Define the blueprint and schemas for SWAPI data
// !1 Need to define mutations but what matters is displaying the mock data first and foremost

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
`;

//   Exporting the data

module.exports = typeDefs;
