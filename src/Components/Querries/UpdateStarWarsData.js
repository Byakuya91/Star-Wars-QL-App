import { gql } from "@apollo/client";

// ! TODO: Work on implementing a query for Updating the StarWarsData
// src/Queries/UpdateCharacterMutation.js

export const UPDATE_CHARACTER = gql`
  mutation UpdateCharacter($name: String!, $speciesName: String!, $homeworldName: String!) {
    updateCharacter(name: $name, speciesName: $speciesName, homeworldName: $homeworldName) {
      id
      name
      species {
        name
      }
      homeworld {
        name
      }
    }
  }
`;


