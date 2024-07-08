import { gql } from "@apollo/client";

export const DELETE_STAR_WARS_CHARACTER = gql`
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id) {
      id
      name
      species
      homeworld
    }
  }
`;
