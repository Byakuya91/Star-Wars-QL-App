import React, { useCallback, useMemo, useState } from "react";
import { useQuery, useApolloClient, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CharacterTable.css";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { DELETE_STAR_WARS_CHARACTER } from "../Querries/DeleteStarWarsCharacter";
import SearchBar from "../StarWarsSearchBar/SearchBar";
import UpdateStarWarsCharactersForm from "../UpdateStarWarsCharacters/UpdateStarWarsCharactersForm";
import Modal from "../Modal/modal";
import StarWarsCharacterForm from "../StarWarsCharacterForm/StarWarsCharacterForm";
import StarWarsCharacter from "../StarWarsCharacter/StarWarsCharacter";
import IsLoadingError from "../../../../src/Components/IsLoadingError/IsLoadingError";

// Defining Types for Star Wars Characters
interface StarWarsCharacterData {
  id: string;
  name: string;
  species: string;
  homeworld: string;
}

interface QueryData {
  allPeople: StarWarsCharacterData[];
}

const CharacterTable: React.FC = () => {
  // ? Pieces of states
  const [showTable, setShowTable] = useState<boolean>(false); // To toggle the visibility of the character table
  const [searchTerm, setSearchTerm] = useState<string>(""); // To store the current search term for filtering
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false); // To control the visibility of the update form modal
  const [showAddStarWarsCharacterForm, setShowAddStarWarsCharacterForm] =
    useState<boolean>(false); // Control the visibility of Star WarsCharacter form
  const [selectedCharacter, setSelectedCharacter] =
    useState<StarWarsCharacterData | null>(null); // To store the currently selected character for updating
  const [sort, setSort] = useState<{
    keyToSort: keyof StarWarsCharacterData;
    direction: "asc" | "desc";
  }>({
    keyToSort: "name",
    direction: "asc",
  }); // To manage the sorting state (column and direction)
  const [currentPage, setCurrentPage] = useState<number>(1); // The current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // The number of characters per page

  // ? Apollo Client and Mutation
  const [deleteStarWarsCharacter] = useMutation(DELETE_STAR_WARS_CHARACTER); // Mutation hook for deleting characters
  const client = useApolloClient(); // Apollo Client instance to read and write to the cache

  // ? Query to fetch characters
  const {
    loading: charactersLoading,
    error: charactersError,
    data: charactersData,
  } = useQuery<QueryData>(GET_STAR_WARS_CHARACTERS, {
    skip: !showTable, // Skip the query if the table is not shown
  });

  // ? Function to check if a character matches the search term
  const findCharacter = (
    item: StarWarsCharacterData,
    searchTerm: string,
    keys: (keyof StarWarsCharacterData)[]
  ) => {
    return keys.some((key) => {
      const value = item[key];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  // ? Memoized function to filter characters based on search term
  const starSearch = useCallback(
    (
      data: StarWarsCharacterData[],
      searchTerm: string,
      keys: (keyof StarWarsCharacterData)[]
    ) => {
      return data.filter((item) => findCharacter(item, searchTerm, keys));
    },
    []
  );

  // ? Memoized function to sort characters by a given key and direction
  const sortData = useCallback(
    (
      data: StarWarsCharacterData[],
      keyToSort: keyof StarWarsCharacterData,
      direction: "asc" | "desc"
    ) => {
      return data.slice().sort((a, b) => {
        const aValue = a[keyToSort].toLowerCase();
        const bValue = b[keyToSort].toLowerCase();
        return direction === "asc"
          ? aValue < bValue
            ? -1
            : aValue > bValue
            ? 1
            : 0
          : aValue > bValue
          ? -1
          : aValue < bValue
          ? 1
          : 0;
      });
    },
    []
  );

  // ? Extracting keys
  const star_Keys: (keyof StarWarsCharacterData)[] = [
    "name",
    "species",
    "homeworld",
  ];

  // ? Memoized list of characters filtered by the search term
  const filteredStarWarsCharacters = useMemo(() => {
    return starSearch(charactersData?.allPeople || [], searchTerm, star_Keys);
  }, [charactersData?.allPeople, searchTerm, starSearch]);

  // ? Memoized list of characters sorted by the current sort state
  const { keyToSort, direction } = sort;
  const sortedStarWarsCharacters = useMemo(() => {
    return sortData(filteredStarWarsCharacters, keyToSort, direction);
  }, [filteredStarWarsCharacters, keyToSort, direction, sortData]);

  // ? Pagination logic: Calculate the indices to slice data
  const indexOfLastStarWarsCharacter = currentPage * itemsPerPage;
  const indexOfFirstStarWarsCharacter =
    indexOfLastStarWarsCharacter - itemsPerPage;
  const currentStarWarsCharacters = sortedStarWarsCharacters.slice(
    indexOfFirstStarWarsCharacter,
    indexOfLastStarWarsCharacter
  );

  // ? Event Handlers
  const handleShowTableClick = () => setShowTable(true); // Show the table of characters
  const handleHideTableClick = () => setShowTable(false); // Hide the table of characters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value); // Update search term based on input field
  const handleClearSearchBar = () => setSearchTerm(""); // Clear the search term

  const handleUpdateButtonClick = (character: StarWarsCharacterData) => {
    setSelectedCharacter(character); // Set the selected character for updating
    setShowUpdateForm(true); // Show the update form modal
  };

  const handleFormClose = () => {
    setShowUpdateForm(false); // Close the update form modal
    setSelectedCharacter(null); // Reset selected character
  };

  // ? StarWarsCharacter modal handlers
  const handleAddStarWarsCharacterFormOpen = () =>
    setShowAddStarWarsCharacterForm(true);
  const handleAddStarWarsCharacterFormClose = () =>
    setShowAddStarWarsCharacterForm(false);

  const handleSort = (key: keyof StarWarsCharacterData) => {
    const newDirection = sort.direction === "asc" ? "desc" : "asc"; // Toggle sorting direction
    setSort({ keyToSort: key, direction: newDirection }); // Update sort state
  };

  // ? Pagination handlers
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

  // ? Function to handle character deletion
  const handleDeleteCharacter = async (character: StarWarsCharacterData) => {
    try {
      await deleteStarWarsCharacter({ variables: { id: character.id } });

      // Update the Apollo Client cache
      const cachedData = client.readQuery<QueryData>({
        query: GET_STAR_WARS_CHARACTERS,
      });
      if (!cachedData) return;

      const updatedCharacters = cachedData.allPeople.filter(
        (char) => char.id !== character.id
      );
      client.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: { allPeople: updatedCharacters },
      });

      toast.success("Character successfully deleted!"); // Show success toast
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character."); // Show error toast
    }
  };

  return (
    <>
      {showTable ? (
        <div className="container">
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            clearSearchBar={handleClearSearchBar}
          />
          <button className="btn" onClick={handleAddStarWarsCharacterFormOpen}>
            Add Star Wars Character
          </button>
          <Modal
            isOpen={showAddStarWarsCharacterForm}
            onClose={handleAddStarWarsCharacterFormClose}
          >
            <StarWarsCharacterForm
              handleAddStarWarsCharacterFormClose={
                handleAddStarWarsCharacterFormClose
              }
            />
          </Modal>
          <button className="btn" onClick={handleHideTableClick}>
            Hide Star Wars Characters
          </button>
          <Modal isOpen={showUpdateForm} onClose={handleFormClose}>
            <UpdateStarWarsCharactersForm
              character={selectedCharacter}
              onClose={handleFormClose}
            />
          </Modal>
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
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
          {charactersLoading || charactersError ? (
            <IsLoadingError
              isLoading={charactersLoading}
              isError={charactersError}
              error={charactersError?.message}
            />
          ) : (
            <table className="table-container">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Actions</th>
                  <th onClick={() => handleSort("name")}>
                    Name{" "}
                    {sort.keyToSort === "name" &&
                      (sort.direction === "asc" ? "▲(Asc)" : "▼(Desc)")}
                  </th>
                  <th onClick={() => handleSort("species")}>
                    Species{" "}
                    {sort.keyToSort === "species" &&
                      (sort.direction === "asc" ? "▲(Asc)" : "▼(Desc)")}
                  </th>
                  <th onClick={() => handleSort("homeworld")}>
                    Homeworld{" "}
                    {sort.keyToSort === "homeworld" &&
                      (sort.direction === "asc" ? "▲(Asc)" : "▼(Desc)")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentStarWarsCharacters.map((character, index) => (
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
                    <StarWarsCharacter character={character} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          <button onClick={handleShowTableClick}>
            Show Star Wars Characters
          </button>
        </div>
      )}
    </>
  );
};

export default CharacterTable;
