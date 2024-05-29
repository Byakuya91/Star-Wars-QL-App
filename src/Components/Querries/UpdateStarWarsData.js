import { gql } from "@apollo/client";

// ! TODO: Work on implementing a query for Updating the StarWarsData
// src/Queries/UpdateCharacterMutation.js

export const UPDATE_CHARACTER = gql`
  mutation UpdateCharacter($id: ID!, $name: String!, $speciesId: ID, $homeworldId: ID) {
  updateCharacter(id: $id, name: $name, speciesId: $speciesId, homeworldId: $homeworldId) {
    id
    name
    species {
      id
      name
    }
    homeworld {
      id
      name
    }
  }
}
`;


