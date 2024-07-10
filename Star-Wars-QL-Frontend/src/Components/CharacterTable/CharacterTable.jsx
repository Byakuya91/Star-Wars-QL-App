// Function to check if an individual item (character) matches the search criteria(OLD TAKE)
// const findCharacter = (item, searchTerm, keys) => {
//   // Iterate over the keys (name, species.name, homeworld.name)
//   return keys.some((key) => {
//     // Split the key to handle nested properties (e.g., 'species.name' -> ['species', 'name'])
//     const keyParts = key.split(".");
//     let value = item;

//     // Traverse the nested properties to get the value
//     keyParts.forEach((part) => {
//       value = value && value[part];
//     });

//     // Check if the value is a string and contains the search term (case-insensitive)
//     return (
//       typeof value === "string" &&
//       value.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });
// };

// ? New function removes the nested element as it directly locates the keys within the fields

const findCharacter = (item, searchTerm, keys) => {
  return keys.some((key) => {
    const value = item[key];
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
import { useApolloClient, useMutation } from "@apollo/client";
// ?CSS imports
import "./CharacterTable.css";

// ?Query imports
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { DELETE_STAR_WARS_CHARACTER } from "../Querries/DeleteStarWarsCharacter";
// ? Component imports
import SearchBar from "../StarWarsSearchBar/SearchBar";

// ? Third party imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ! Component imports
import UpdateStarWarsCharactersForm from "../UpdateStarWarsCharacters/UpdateStarWarsCharactersForm";
import Modal from "../Modal/modal";
import StarWarsCharacterForm from "../StarWarsCharacterForm/StarWarsCharacterForm";

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

  // ? Query pieces of state
  // ! removing a character
  const [deleteStarWarsCharacter] = useMutation(DELETE_STAR_WARS_CHARACTER);

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
  // ! Not working due to TYPEERROR
  // const handleDeleteCharacter = async (character) => {
  //   try {
  //     // 1. Call the deleteStarWarsCharacter mutation to delete the character
  //     const { data } = await deleteStarWarsCharacter({
  //       variables: { id: character.id },
  //     });

  //     // 2. Check if charactersData.allPeople exists before filtering
  //     const updatedCharacters = charactersData.allPeople
  //       ? charactersData.allPeople.people.filter(
  //           (char) => char.id !== character.id
  //         )
  //       : [];

  //     // 3. Update the Apollo cache with the updated characters data
  //     client.writeQuery({
  //       query: GET_STAR_WARS_CHARACTERS,
  //       data: {
  //         allPeople: {
  //           ...charactersData.allPeople, // Preserve other fields from allPeople
  //           people: updatedCharacters, // Update the people array with filtered characters
  //         },
  //       },
  //     });

  //     // 4. Notify user of successful deletion
  //     toast.success("Character successfully deleted!");
  //   } catch (error) {
  //     // 5. Handle errors if deletion fails
  //     console.error("Error deleting character:", error);
  //     toast.error("Failed to delete character.");
  //   }
  // };

  // ?! New version
  const handleDeleteCharacter = async (character) => {
    try {
      const { data } = await deleteStarWarsCharacter({
        variables: { id: character.id },
      });

      // Assuming data.deleteCharacter returns the deleted character's ID or details

      // Fetch the current cached data
      const cachedData = client.readQuery({
        query: GET_STAR_WARS_CHARACTERS,
      });

      if (!cachedData) return;

      // Update the cached data by filtering out the deleted character
      const updatedCharacters = cachedData.allPeople.filter(
        (char) => char.id !== character.id
      );

      // Write the updated data back to the cache
      client.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: {
          allPeople: updatedCharacters,
        },
      });

      toast.success("Character successfully deleted!");
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character.");
    }
  };

  // Function to filter characters based on search criteria
  const starSearch = (data, searchTerm, keys) => {
    // Filter the data (characters) using the findCharacter function
    return data.filter((item) => findCharacter(item, searchTerm, keys));
  };

  // ? In case the data does NOT load for Names, Species and Homeworld
  if (charactersLoading) return <p>Loading...</p>;

  // ? Old error message
  // if (charactersError) return <p>Error: {charactersError.message} </p>;
  // ? New message
  if (charactersError) {
    console.error("Error loading characters:", charactersError);
    return <p>Error: {charactersError.message}</p>;
  }

  //! Define search keys for filtering
  //  ? Defining keys based on the fields for the table
  const Star_keys = ["name", "species", "homeworld"];

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
          <StarWarsCharacterForm />
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
