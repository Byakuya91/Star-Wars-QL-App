// ! Important exports
import { gql } from "@apollo/client";

// New update
// Define the GraphQL query
export const GET_STAR_WARS_CHARACTERS = gql`
  query StarWarsCharactersQuery {
    allPeople {
      id
      name
      species
      homeworld
    }
  }
`;
