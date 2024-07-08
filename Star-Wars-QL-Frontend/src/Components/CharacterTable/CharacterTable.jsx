// Function to check if an individual item (character) matches the search criteria
const findCharacter = (item, searchTerm, keys) => {
  // Iterate over the keys (name, species.name, homeworld.name)
  return keys.some((key) => {
    // Split the key to handle nested properties (e.g., 'species.name' -> ['species', 'name'])
    const keyParts = key.split(".");
    let value = item;

    // Traverse the nested properties to get the value
    keyParts.forEach((part) => {
      value = value && value[part];
    });

    // Check if the value is a string and contains the search term (case-insensitive)
    return (
      typeof value === "string" &&
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
};

// Export the findCharacter function for testing
export { findCharacter };

// ?React imports
import React, { useState } from "react";

// ? Apollo and dependency imports
import { useQuery } from "@apollo/client";
// ?CSS imports
import "./CharacterTable.css";

// ?Query imports
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import SearchBar from "../StarWarsSearchBar/SearchBar";
import { useApolloClient } from "@apollo/client";

// ? Third party imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ! Component imports
import UpdateStarWarsCharactersForm from "../UpdateStarWarsCharacters/UpdateStarWarsCharactersForm";
import Modal from "../Modal/modal";

// TODOS:KEY TASKS
// 1) Refactor query calls to include Home-world and species(DONE)
// 2) Render out the data onto the table(DONE)
// 3) Set the Stage for the filtering application of the table, based on NAME,SPECIES, and HOMEWORLD(DONE)
// 4) Update the data:
// 4A) Create UpdateCharacters component
// 4B) Create a query to handle updating the data(DO RESEARCH)
// 4C) Hook up the buttons

// TODOS: supplementary tasks
// 1) Theme and Dark theme toggler(ONGOING)

// This is a new update

const CharacterTable = () => {
  // ? Pieces of states
  // ? Toggling the table view
  const [showTable, setShowTable] = useState(false);
  // ? SearchBar results state
  const [searchTerm, setSearchTerm] = useState("");
  // ? visibility of the update character form
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  // ? Store the selected character for an update
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Use the useQuery hook to fetch data, skipping the query if showTable is false

  //! Fetch data for Star Wars names
  const {
    loading: charactersLoading,
    error: charactersError,
    data: charactersData,
    refetch,
  } = useQuery(GET_STAR_WARS_CHARACTERS, {
    skip: !showTable, // Skip the query if showTable is false
    //  ?Attempting to solve stale cache
  });

  // ? Checking if the characters data is being logged
  // console.log("charactersData:", charactersData); // Add this line to log the data

  // ! Handler functions
  // ? Showing and hiding the table
  const handleShowTableClick = () => {
    setShowTable(true); // Set showTable to true when the button is clicked
  };

  const handleHideTableClick = () => {
    setShowTable(false); // Set showTable to false when the "Hide" button is clicked
  };

  // ? Handler: Changing the search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ?Handler: Clear the searchBar
  const handleClearSearchBar = () => {
    setSearchTerm("");
  };

  // ! Handlers for CRUD operations for the table
  // ? Handler: show the update form
  const handleUpdateButtonClick = (character) => {
    // console.log("The character is:", character);
    setSelectedCharacter(character);
    // console.log("The state of show Update form is:",showUpdateForm);
    setShowUpdateForm(true);
    // console.log("The state of show Update form when the button is pushed is:", showUpdateForm);
  };

  // ? Handler: Opening and closing the form
  const handleFormClose = () => {
    setShowUpdateForm(false);
    setSelectedCharacter(null);
  };

  // Inside the functional component
  const client = useApolloClient();

  // ? Handling the deletion of a character.
  const handleDeleteCharacter = (character) => {
    //? Testing the button if it works(IT WORKS)
    // console.log("Deleting character:", character);

    //? STEP ONE: remove the character from local state or cache
    const updatedCharacters = charactersData.allPeople.people.filter(
      (char) => char.id !== character.id
    );

    // ! //(WORKING) Update the cache with the updated data
    client.writeQuery({
      query: GET_STAR_WARS_CHARACTERS, // The query used to fetch the data
      data: {
        allPeople: {
          ...charactersData.allPeople,
          people: updatedCharacters,
        },
      },
    });

    // ? Alerting  the user that the character is deleted.
    toast.error("Character successfully deleted!");
  };

  // Function to filter characters based on search criteria
  const starSearch = (data, searchTerm, keys) => {
    // Filter the data (characters) using the findCharacter function
    return data.filter((item) => findCharacter(item, searchTerm, keys));
  };

  // ? In case the data does NOT load for Names, Species and Homeworld
  if (charactersLoading) return <p>Loading...</p>;

  if (charactersError) return <p>Error: {charactersError.message} </p>;

  //! Define search keys for filtering
  //  ? Defining keys based on the fields for the table
  const Star_keys = ["name", "species.name", "homeworld.name"];

  // Use the starSearch function to filter characters based on the search term
  const filteredStarWarsCharacters = charactersData?.allPeople
    ? starSearch(charactersData.allPeople, searchTerm, Star_keys)
    : [];

  return (
    <div>
      {/* <Modal /> */}
      {showTable ? (
        <div className="container">
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            clearSearchBar={handleClearSearchBar}
          />
          <button className="btn" onClick={handleHideTableClick}>
            Hide Star Wars Characters
          </button>
          {showUpdateForm && (
            <UpdateStarWarsCharactersForm
              character={selectedCharacter}
              onClose={handleFormClose}
              // onUpdate={}
            />
          )}
          <table className="table-container">
            <thead>
              <tr>
                <th>No.</th>
                <th>Actions</th>
                <th>Name</th>
                <th>Species</th>
                <th>Homeworld</th>
              </tr>
            </thead>
            <tbody>
              {filteredStarWarsCharacters.map((character, index) => (
                <tr key={character.id}>
                  <td>
                    <b>{index + 1}</b>
                  </td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateButtonClick(character)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCharacter(character)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <b>{character.name}</b>
                  </td>
                  <td>
                    <b>{character.species}</b>
                  </td>
                  <td>
                    <b>{character.homeworld}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <UpdateStarWarsCharactersForm  character={selectedCharacter}/> */}
          {/* Render the update form if showUpdateForm is true */}
        </div>
      ) : (
        <div>
          <button onClick={handleShowTableClick}>
            Show Star Wars Characters
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterTable;
