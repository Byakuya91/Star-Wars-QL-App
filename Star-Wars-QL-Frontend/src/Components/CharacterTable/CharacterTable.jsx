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
// 4A) Create UpdateCharacters component(DONE)
// 4B) Create a query to handle updating the data(DONE)
// 4C) Hook up the buttons(DONE)
// 5) ADD Sort function to sort the table based on alphabetically or fields like name and species.

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

  // ? State for managing sorting, indicating the key to sort by and the direction (ascending or descending)
  const [sort, setSort] = useState({ keyToSort: "name", direction: "asc" });

  // ? Testing the sort and setSort for the Handler function
  console.log("the DEFAULT sort value is:", sort);

  // Use the useQuery hook to fetch data, skipping the query if showTable is false

  // TODO: Sorting Capabilities
  // 1) handler function to "sort" the state whenever a column header is CLICKED.(DONE)
  // 2) a function to sort the data based on the key(DONE)
  // 3) implementing the data into the table(ONGOING)
  // 3A) test the "asc" and "desc" handler function(DONE)
  //  3B) implement the buttons into the headers on JSX(DONE)
  // 3C) hook up the sortedStarWarsCharacters into the table

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

  // ?Handler:

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
  const handleSort = (key) => {
    // ?STEP ONE: define a direction for the data.
    const direction = sort.direction === "asc" ? "desc" : "asc";
    //  ?STEP TWO: use the setter
    setSort({ keyToSort: key, direction });
  };

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

  //? Function to filter characters based on search criteria
  const starSearch = (data, searchTerm, keys) => {
    // Filter the data (characters) using the findCharacter function
    return data.filter((item) => findCharacter(item, searchTerm, keys));
  };

  // ? a function to sort the data
  const sortData = (data, keyToSort, direction) => {
    //  STEP ONE: create a shallow copy of an array and sort it
    return data.slice().sort((a, b) => {
      // STEP TWO: extract the values for comparison, accounting for case sensitivity
      const aValue = a[keyToSort].toLowerCase();
      const bValue = b[keyToSort].toLowerCase();

      // ! OLD CODE: hard to understand/ read
      // if (direction === "asc") {
      //   return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      // } else {
      //   return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      // }

      // STEP THREE: comparisons based on "asc" and "dsc" and their index.(NEW TAKE: MORE READABLE)
      // ?sorting order "asc" conditionals
      if (direction === "asc") {
        // ?Asc order: aValue BEFORE bValue
        if (aValue < bValue) {
          // NOTE the values for "return" mean the order of elements during sorting.
          return -1;
          // ? Asc order: aValue AFTER bValue
        } else if (aValue > bValue) {
          return 1;
        } else {
          // ? aValue and Bvalue are the SAME
          return 0;
        }
      } else {
        // ? sorting order "desc" conditionals
        // ?Desc order: a BEFORE b
        if (aValue > bValue) {
          return -1;
          // ? Desc order: a AFTER B
        } else if (aValue < bValue) {
          return 1; // a comes after b
          //? Both are the same
        } else {
          return 0; // a and b are equal
        }
      }
    });
  };

  //  ! Tests of the sort(PASSED)

  // const TestStarWarsCharacters = [
  //   { id: "1", name: "Leia Organa", species: "Human", homeworld: "Alderaan" },
  //   { id: "2", name: "Darth Vader", species: "Human", homeworld: "Tatooine" },
  //   { id: "3", name: "Han Solo", species: "Human", homeworld: "Tatooine" },
  //   { id: "4", name: "R2-D2", species: "Droid", homeworld: "Naboo" },
  //   { id: "5", name: "C-3PO", species: "Droid", homeworld: "Tatooine" },
  // ];

  // // Sorting by 'name' in ascending order
  // const sortedByNameAsc = sortData(TestStarWarsCharacters, "name", "asc");

  // // Sorting by 'name' in descending order
  // const sortedByNameDesc = sortData(TestStarWarsCharacters, "name", "desc");

  // // Sorting by 'homeworld' in ascending order
  // const sortedByHomeworldAsc = sortData(
  //   TestStarWarsCharacters,
  //   "homeworld",
  //   "asc"
  // );

  // // Sorting by 'homeworld' in descending order
  // const sortedByHomeworldDsc = sortData(
  //   TestStarWarsCharacters,
  //   "homeworld",
  //   "dsc"
  // );

  // console.log(
  //   "the Test mock data for Star Wars Characters UNALTERED IS:",
  //   TestStarWarsCharacters
  // );
  // console.log("The results for sortedByNameAsc is:", sortedByNameAsc);

  // console.log("The results for sortedByNameDsc is:", sortedByNameDesc);

  // console.log("The results for sortedByHomeworldAsc is:", sortedByHomeworldAsc);

  // console.log("The results for sortedByHomeworldDsc is:", sortedByHomeworldDsc);

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

  //? Use the starSearch function to filter characters based on the search term
  const filteredStarWarsCharacters = charactersData?.allPeople
    ? starSearch(charactersData.allPeople, searchTerm, Star_keys)
    : [];

  // ? Creating a new piece of state to sort the filetered StarWars Characters

  const { keyToSort, direction } = sort;
  const sortedStarWarsCharacters = sortData(
    filteredStarWarsCharacters,
    keyToSort,
    direction
  );

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
                <th onClick={() => handleSort("name")}>Name</th>
                <th onClick={() => handleSort("species")}>Species</th>
                <th onClick={() => handleSort("homeworld")}>Homeworld</th>
              </tr>
            </thead>
            <tbody>
              {sortedStarWarsCharacters.map((character, index) => (
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
