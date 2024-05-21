// ! Important exports
import { gql } from '@apollo/client';

// Define the GraphQL query
export const GET_STAR_WARS_CHARACTERS = gql`
  query StarWarsCharactersQuerry {
    allPeople {
      people {
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
  }
`;
