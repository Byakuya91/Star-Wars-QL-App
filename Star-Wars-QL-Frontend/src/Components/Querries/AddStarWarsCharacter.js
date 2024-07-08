import { gql } from "@apollo/client";

export const ADD_STAR_WARS_CHARACTER = gql`
  mutation AddCharacter($name: String!, $species: String, $homeworld: String) {
    addCharacter(name: $name, species: $species, homeworld: $homeworld) {
      id
      name
      species
      homeworld
    }
  }
`;
