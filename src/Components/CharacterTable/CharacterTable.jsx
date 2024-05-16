// ?React imports 
import React, { useState } from 'react';

// ? Apollo and dependency imports 
import { useQuery } from '@apollo/client';
// ?CSS imports 
import './CharacterTable.css';


// ?Query imports 
import { GET_STAR_WARS_NAMES } from '../Querries/StarWarsNames';

import { GET_STAR_WARS_SPECIES_AND_WORLDS } from '../Querries/StarWarsSpeciesAndWorld';

// TODOS:
// 1) Refactor query calls to include Home-world and species(DONE)
// 2) Render out the data onto the table(ONGOING)
// 1) Set the Stage for the filtering application of the table, based on NAME,SPECIES, and HOMEWORLD  



const CharacterTable = () => {

// ? Toggle state variables for the button 
const [showTable, setShowTable] = useState(false);


  //! Fetch data for Star Wars names 
  const { loading: namesLoading, error: namesError, data:namesData } = useQuery(GET_STAR_WARS_NAMES, {
    skip: !showTable // Skip the query if showTable is false
  });

// ! Fetch Data for Star Wars Species and HomeWorld 
  const { loading: speciesLoading, error: speciesError, data:speciesData } = useQuery(GET_STAR_WARS_SPECIES_AND_WORLDS, {
    skip: !showTable // Skip the query if showTable is false
  });


  
  

  // ? Handler functions for buttons 
  const handleShowTableClick = () => {
    setShowTable(true); // Set showTable to true when the button is clicked
  };

  const handleHideTableClick = () => {
    setShowTable(false); // Set showTable to false when the "Hide" button is clicked
  };

  // if (!showTable) {
  //   return (
  //     <div>
  //       <button onClick={handleShowTableClick}>Show Star Wars Characters</button>
  //     </div>
  //   );
  // }

  // Trying to make a tenary operation for the code
//  showTable ? 

  // ? In case the data does NOT load for Names, Species and Homeworld

  if (namesLoading || speciesLoading ) 
    return <p>Loading...</p>;

  if (namesError || speciesError) 
    return <p>Error: {namesError.message ? namesError.message : speciesError.message}</p>;



// USING MOCK DATA to fill in the table and get a sense of what it looks like
// const mockData = {
//   allPeople: {
//     people: [
//       { name: 'Luke Skywalker' },
//       { name: 'Han Solo' },
//       { name: 'Princess Leia' },
//       { name: 'Chewbacca' },
//       { name: 'Darth Vader' },
//       { name: 'Lando' },
//       { name: 'C-3PO' },
//       { name: 'R2-D2' },
//       // Add more sample data as needed
//     ]
//   }
// };
// TODO: Write the units test using JEST framework, mock the GraphQL data.Mock GraphQL response locally
// TODO: Use it in the unit test cases. GraphQL proper response, Case one.

return (
  <div>
    {showTable ? (
      <div className='container'>
          <div>Search bar placeholder</div>
        <button  className = "btn" 
        onClick={handleHideTableClick}>Hide Star Wars Characters</button>
        <table>
          <thead>
            <tr>
            <th>No.</th>
              <th>Name</th>
              <th>Species</th>
              <th>Homeworld</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over the fetched data and display names */}

            {namesData.allPeople.people.map((character, index) => (
              <tr key={index}>
                  <td> <b>{index + 1}</b></td> {/* Display the index starting from 1 */}
                <td> <b>{character.name}</b></td>
              </tr>
            ))}
            {/* <td>{speciesData.allPeople.people}</td> */}
          </tbody>
        </table>
      </div>
    ) : (
      <div>
        <button onClick={handleShowTableClick}>Show Star Wars Characters</button>
      </div>
    )}
  </div>
);

};

export default CharacterTable;
