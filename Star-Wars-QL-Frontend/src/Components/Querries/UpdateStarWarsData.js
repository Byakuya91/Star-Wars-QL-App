import { gql } from "@apollo/client";

// Define the GraphQL mutation for updating a character
export const UPDATE_CHARACTER = gql`
  mutation UpdateCharacter(
    $id: ID!
    $name: String
    $species: String
    $homeworld: String
  ) {
    updateCharacter(
      id: $id
      name: $name
      species: $species
      homeworld: $homeworld
    ) {
      id
      name
      species
      homeworld
    }
  }
`;
