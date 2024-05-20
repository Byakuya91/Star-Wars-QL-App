// ?React imports 
import React, { useState } from 'react';

// ? Apollo and dependency imports 
import { useQuery } from '@apollo/client';
// ?CSS imports 
import './CharacterTable.css';

// ?Query imports 
import { GET_STAR_WARS_CHARACTERS } from '../Querries/StarWarsNames';
import SearchBar from '../StarWarsSearchBar/SearchBar';

// TODOS:KEY TASKS
// 1) Refactor query calls to include Home-world and species(DONE)
// 2) Render out the data onto the table(DONE)
// 1) Set the Stage for the filtering application of the table, based on NAME,SPECIES, and HOMEWORLD(ONGOING) 

// TODOS: supplementary tasks
// 1) Theme and Dark theme toggler 

const CharacterTable = () => {
//  ? Defining keys based on the fields for the table
const Star_keys = ['name', 'species.name', 'homeworld.name'];


    // ? Pieces of states
    // ? Toggling the table view
    const [showTable, setShowTable] = useState(false);
    // ? SearchBar results state
    const [searchTerm, setSearchTerm] = useState('');

    //! Fetch data for Star Wars names 
    const { loading: charactersLoading, error: charactersError, data: charactersData } = useQuery(GET_STAR_WARS_CHARACTERS, {
        skip: !showTable // Skip the query if showTable is false
    });

    // ? Handler functions
    // ? Showing and hiding the table
    const handleShowTableClick = () => {
        setShowTable(true); // Set showTable to true when the button is clicked
    };

    const handleHideTableClick = () => {
        setShowTable(false); // Set showTable to false when the "Hide" button is clicked
    };

    // ? Changing the search term 
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // ? Clear the searchBar
    const clearSearchBar = () =>{
      setSearchTerm('');
    }

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




    // TODO: Create a search function for the filtered results 
    const starSearch = (data) => {
        return data.filter(item =>
            //  ? For each item, check if one of the Star_Keys contains the search term
            Star_keys.some((key) => {
                // Split the keys to handle nested properties
                const keys = key.split('.');
                // Start with the current item
                let value = item;
                // Traverse the nested properties
                keys.forEach(k => {
                    value = value && value[k];
                });
                // Check if the final value exists and contains the searchTerm
                return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    };


    // OLD CODE 
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
    if (charactersLoading) 
        return <p>Loading...</p>;
    
    if (charactersError) 
        return <p>Error: {charactersError.message} </p>;
    
    //!  Create the filtered data that will be used by the new Map
    const filteredStarWarsCharacters = charactersData && charactersData.allPeople && charactersData.allPeople.people ? starSearch(charactersData.allPeople.people) : [];

    return (
        <div>
            {showTable ? (
                <div className='container'>
                    <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange}  clearSearchBar = {clearSearchBar}/>
                    <button className="btn" onClick={handleHideTableClick}>Hide Star Wars Characters</button>
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
                            {filteredStarWarsCharacters.map((character, index) => (
                                <tr key={index}>
                                    <td><b>{index + 1}</b></td> {/* Display the index starting from 1 */}
                                    <td><b>{character.name}</b></td>
                                    <td><b>{character.species ? character.species.name : 'Unknown'}</b></td>
                                    <td><b>{character.homeworld ? character.homeworld.name : 'Unknown'}</b></td>
                                </tr>
                            ))}
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
