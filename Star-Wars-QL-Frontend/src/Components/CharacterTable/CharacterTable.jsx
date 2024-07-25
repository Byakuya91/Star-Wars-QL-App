// ?React Imports
import React, { useCallback, useMemo, useState } from "react";
// ?Apollo imports
import { useQuery, useApolloClient, useMutation } from "@apollo/client";
// ?Third party library imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CharacterTable.css";
// ?Query imports
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { DELETE_STAR_WARS_CHARACTER } from "../Querries/DeleteStarWarsCharacter";
// ?Component imports
import SearchBar from "../StarWarsSearchBar/SearchBar";
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
// 5) ADD Sort function to sort the table based on alphabetically or fields like name and species(DONE)

// TODOS: supplementary tasks
// 1) Theme and Dark theme toggler(ONGOING)

// Pagimation

const CharacterTable = () => {
  // ? Pieces of states
  const [showTable, setShowTable] = useState(false); // To toggle the visibility of the character table
  const [searchTerm, setSearchTerm] = useState(""); // To store the current search term for filtering
  const [showUpdateForm, setShowUpdateForm] = useState(false); // To control the visibility of the update form modal
  const [selectedCharacter, setSelectedCharacter] = useState(null); // To store the currently selected character for updating
  const [sort, setSort] = useState({ keyToSort: "name", direction: "asc" }); // To manage the sorting state (column and direction)

  // Apollo Client and Mutation
  const [deleteStarWarsCharacter] = useMutation(DELETE_STAR_WARS_CHARACTER); // Mutation hook for deleting characters
  const client = useApolloClient(); // Apollo Client instance to read and write to the cache
  // Pagimation

  //  The current page number
  const [currentPage, setCurrentPage] = useState(1);
  // The number of charactersPerPage
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //? Query to fetch characters
  const {
    loading: charactersLoading,
    error: charactersError,
    data: charactersData,
    refetch,
  } = useQuery(GET_STAR_WARS_CHARACTERS, {
    skip: !showTable, // Skip the query if the table is not shown
  });

  //? Function to check if a character matches the search term
  const findCharacter = (item, searchTerm, keys) => {
    return keys.some((key) => {
      const value = item[key];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  // ?Memoized function to filter characters based on the search term
  const starSearch = useCallback((data, searchTerm, keys) => {
    return data.filter((item) => findCharacter(item, searchTerm, keys));
  }, []);

  //? Memoized function to sort characters by a given key and direction
  const sortData = useCallback((data, keyToSort, direction) => {
    return data.slice().sort((a, b) => {
      const aValue = a[keyToSort].toLowerCase();
      const bValue = b[keyToSort].toLowerCase();
      if (direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, []);

  // ?Memoized list of characters filtered by the search term
  const filteredStarWarsCharacters = useMemo(() => {
    return starSearch(charactersData?.allPeople || [], searchTerm, [
      "name",
      "species",
      "homeworld",
    ]);
  }, [charactersData?.allPeople, searchTerm, starSearch]);

  //? Memoized list of characters sorted by the current sort state
  const { keyToSort, direction } = sort;
  const sortedStarWarsCharacters = useMemo(() => {
    return sortData(filteredStarWarsCharacters, keyToSort, direction);
  }, [filteredStarWarsCharacters, keyToSort, direction, sortData]);

  //? Pagimation logic: Calculate the indices to slice data
  const indexOfLastStarWarsCharacter = currentPage * itemsPerPage;
  const indexOfFirstStarWarsCharacter =
    indexOfLastStarWarsCharacter - itemsPerPage;
  const currentStarWarsCharacters = sortedStarWarsCharacters.slice(
    indexOfFirstStarWarsCharacter,
    indexOfLastStarWarsCharacter
  );

  //? Event Handlers
  const handleShowTableClick = () => {
    setShowTable(true); // Show the table of characters
  };

  const handleHideTableClick = () => {
    setShowTable(false); // Hide the table of characters
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term based on input field
  };

  const handleClearSearchBar = () => {
    setSearchTerm(""); // Clear the search term
  };

  const handleUpdateButtonClick = (character) => {
    setSelectedCharacter(character); // Set the selected character for updating
    setShowUpdateForm(true); // Show the update form modal
  };

  const handleFormClose = () => {
    setShowUpdateForm(false); // Close the update form modal
    setSelectedCharacter(null); // Reset selected character
  };

  const handleSort = (key) => {
    const direction = sort.direction === "asc" ? "desc" : "asc"; // Toggle sorting direction
    setSort({ keyToSort: key, direction }); // Update sort state
  };

  //? Pagimation handlers
  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(sortedStarWarsCharacters.length / itemsPerPage)
      )
    );
  };
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handlePageChange = () => {
    setCurrentPage(pageNumber);
  };

  // Use the useQuery hook to fetch data, skipping the query if showTable is false

  // TODO: Sorting Capabilities(DONE)
  // 1) handler function to "sort" the state whenever a column header is CLICKED.(DONE)
  // 2) a function to sort the data based on the key(DONE)
  // 3) implementing the data into the table(ONGOING)
  // 3A) test the "asc" and "desc" handler function(DONE)
  //  3B) implement the buttons into the headers on JSX(DONE)
  // 3C) hook up the sortedStarWarsCharacters into the table(DONE)

  // TODO: Pagimantion(ONGOING)
  // 1)Establish pieces of state(DONE)
  // 2)handler functions to operate the buttons to shift pages(DONE)
  // 3)Calculate the Pagimated data for each page(DONE)
  // 4)Render the Pagimation controls(ONGOING)

  // Function to handle character deletion
  const handleDeleteCharacter = async (character) => {
    try {
      await deleteStarWarsCharacter({
        variables: { id: character.id },
      });

      // Update the Apollo Client cache
      const cachedData = client.readQuery({
        query: GET_STAR_WARS_CHARACTERS,
      });

      if (!cachedData) return;

      const updatedCharacters = cachedData.allPeople.filter(
        (char) => char.id !== character.id
      );

      client.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: {
          allPeople: updatedCharacters,
        },
      });

      toast.success("Character successfully deleted!"); // Show success toast
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character."); // Show error toast
    }
  };

  //? Conditional Rendering if the page does NOT load
  if (charactersLoading) return <p>Loading...</p>; // Show loading indicator
  if (charactersError) {
    console.error("Error loading characters:", charactersError);
    return <p>Error: {charactersError.message}</p>; // Show error message
  }

  return (
    <div>
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
          <Modal isOpen={showUpdateForm} onClose={handleFormClose}>
            <UpdateStarWarsCharactersForm
              character={selectedCharacter}
              onClose={handleFormClose}
            />
          </Modal>
          <div className="pagimation-controls">
            <button onClick={handlePreviousPage} disabled={itemsPerPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage ===
                Math.ceil(sortedStarWarsCharacters.length / itemsPerPage)
              }
            >
              Next
            </button>
          </div>
          <table className="table-container">
            <thead>
              <tr>
                <th>No.</th>
                <th>Actions</th>
                <th onClick={() => handleSort("name")}>
                  Name{" "}
                  {sort.keyToSort === "name" &&
                    (sort.direction === "asc" ? "▲ " : "▼ ")}
                </th>
                <th onClick={() => handleSort("species")}>
                  Species
                  {sort.keyToSort === "species" &&
                    (sort.direction === "asc" ? "▲ " : "▼ ")}
                </th>
                <th onClick={() => handleSort("homeworld")}>
                  Homeworld
                  {sort.keyToSort === "homeworld" &&
                    (sort.direction === "asc" ? "▲ " : "▼ ")}
                </th>
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
