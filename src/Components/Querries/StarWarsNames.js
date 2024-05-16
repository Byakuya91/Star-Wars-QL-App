// ! Important exports
import { gql } from '@apollo/client';

// Define the GraphQL query
export const GET_STAR_WARS_NAMES = gql`
  query StarWarsNamesQuery {
    allPeople {
      people {
        name 
      }
    }
  }
`;
