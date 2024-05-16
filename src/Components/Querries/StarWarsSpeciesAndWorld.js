

import { gql } from '@apollo/client';

export const GET_STAR_WARS_SPECIES_AND_WORLDS = gql`
  query StarWarsSpeciesQuery {
    allPeople {
      people {
        name
        species {
          name
        }
        homeworld {
          name
        }
      }
    }
  }
`;
