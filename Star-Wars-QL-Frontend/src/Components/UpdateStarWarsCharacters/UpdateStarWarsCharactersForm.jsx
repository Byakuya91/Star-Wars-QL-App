import React, { useEffect, useState } from "react";

// ? third party & query imports
import { useApolloClient, useMutation } from "@apollo/client";
import { UPDATE_CHARACTER } from "../Querries/UpdateStarWarsData";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// !TODO: Code out the form.
const UpdateStarWarsCharactersForm = ({ character, onUpdate, onClose }) => {
  // TODO:
  // 1) build the HMTL form and comment it to avoid causing an error(DONE)
  // 2) Code out the pieces of state within the form to correspond to the inputs(DONE)
  // 3) make sure to implement  the useMutation hook to see how it work(ONGOING)
  // 4) code out the submit function for a form.

  // ? State variables to hold the form values
  //  ? character name
  const [name, setName] = useState(character.name || "");
  //  ? species name
  const [speciesName, setSpeciesName] = useState(
    character.species ? character.species.name : ""
  );
  // ? // State for homeworld name: '');
  const [homeworldName, setHomeworldName] = useState(
    character.homeworld ? character.homeworld.name : ""
  );

  // New update for git push

  const client = useApolloClient();

  // console.log("The species name is:", speciesName);
  // console.log("The homeworld name is:", homeworldName);
  // console.log("The full name is:", name);

  // Mutation hook for updating character
  const [updateCharacter] = useMutation(UPDATE_CHARACTER);

  // Update state when character prop changes
  useEffect(() => {
    if (character) {
      setName(character.name || "");
      setSpeciesName(character.species ? character.species.name : "");
      setHomeworldName(character.homeworld ? character.homeworld.name : "");
    }
  }, [character]);

  // ! debugging code
  // // ! Testing is the component is being rendered in the DOM
  // useEffect(() => {
  //   console.log("UpdateStarWarsCharactersForm component rendered");
  // }, []); // The empty dependency array ensures the effect runs only once after initial render

  //! Handle form submission(FIRST TAKE DOES NOT WORK)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Submitting update with variables:", {
  //     id: character.id,
  //     name,
  //     speciesName,
  //     homeworldName,
  //   });
  //   try {
  //     await updateCharacter({
  //       variables: {
  //         id: character.id,
  //         name,
  //         speciesName: speciesName || null,
  //         homeworldName: homeworldName || null,
  //       },
  //       update: (cache, { data: { updateCharacter } }) => {
  //         // Read existing data from cache
  //         const existingData = cache.readQuery({ query: GET_STAR_WARS_CHARACTERS });
  //         // Update character in the cache
  //         const updatedPeople = existingData.characters.map(person =>
  //           person.id === character.id ? updateCharacter : person
  //         );
  //         // Write updated data back to cache
  //         cache.writeQuery({
  //           query: GET_STAR_WARS_CHARACTERS,
  //           data: { characters: updatedPeople }
  //         });
  //       }
  //     });
  //     onClose(); // Close the form after successful update
  //   } catch (err) {
  //     console.error("Error updating character:", err); // Log error if mutation fails
  //     console.error("GraphQL Errors:", err.graphQLErrors); // Log specific GraphQL errors
  //       console.error("Network Errors:", err.networkError); // Log network errors
  //   }
  // };

  // ! Second version with local caching.
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Submitting update with variables:", {
  //     id: character.id,
  //     name,
  //     speciesName,
  //     homeworldName,
  //   });

  //   try {
  //     // Perform the update
  //     await updateCharacter({
  //       variables: {
  //         id: character.id,
  //         name,
  //         speciesName: speciesName || null,
  //         homeworldName: homeworldName || null,
  //       },
  //     });

  //     // Read existing data from cache
  //     const existingData = client.readQuery({ query: GET_STAR_WARS_CHARACTERS });

  //     // Ensure existingData is valid and an array
  //     if (existingData && existingData.characters) {
  //       const updatedStarWarsPeople = existingData.characters.map(person =>
  //         person.id === character.id
  //           ? { ...person, name, species: { name: speciesName }, homeworld: { name: homeworldName } }
  //           : person
  //       );

  //       // Write updated data back to cache
  //       client.writeQuery({
  //         query: GET_STAR_WARS_CHARACTERS,
  //         data: { characters: updatedStarWarsPeople },
  //       });

  //       console.log("Cache after update:", client.readQuery({ query: GET_STAR_WARS_CHARACTERS }));
  //       onClose(); // Close the form after successful update
  //     } else {
  //       console.error("Error: existingData.characters is not an array");
  //     }
  //   } catch (err) {
  //     console.error("Error updating character:", err); // Log error if mutation fails
  //     console.error("GraphQL Errors:", err.graphQLErrors); // Log specific GraphQL errors
  //     console.error("Network Errors:", err.networkError); // Log network errors
  //   }
  // };

  // ! Third iteration
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Updating the cache with variables:", {
      id: character.id,
      name,
      speciesName,
      homeworldName,
    });

    try {
      // Read the existing data from the Apollo Client cache
      const existingData = client.readQuery({
        query: GET_STAR_WARS_CHARACTERS,
      });
      console.log("Existing data from cache:", existingData);

      // Check if the data exists in the cache and has the expected structure
      if (
        !existingData ||
        !existingData.allPeople ||
        !existingData.allPeople.people
      ) {
        throw new Error("Error: existingData.allPeople.people is not defined");
      }

      // Map through the existing characters and update the one that matches the character.id
      const updatedPeople = existingData.allPeople.people.map((person) =>
        person.id === character.id
          ? {
              ...person,
              name,
              species: { name: speciesName },
              homeworld: { name: homeworldName },
            }
          : person
      );

      // Write the updated data back to the Apollo Client cache
      client.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: {
          allPeople: { ...existingData.allPeople, people: updatedPeople },
        },
      });

      // Show a success notification
      toast.success("Character updated successfully!");
      // Close the form after a successful update
      onClose();
    } catch (err) {
      console.error("Error updating cache:", err);
      toast.error("Error updating character!");
    }

    // ? updating the cache locally and avoiding the component calling the API to revert the changes.
    // ! SWAPI does NOT support mutations
    // useEffect(() => {
    //   // This function will be called whenever a 'storage' event is triggered
    //   const syncLocalStorageChanges = (event) => {
    //     // Check if the local storage key that triggered the event is 'yourLocalStorageKey'
    //     if (event.key === "yourLocalStorageKey") {
    //       // Reload the window to update the UI with the latest data from local storage
    //       window.location.reload();
    //     }
    //   };

    //   // Add an event listener for the 'storage' event to detect changes in local storage
    //   window.addEventListener("storage", syncLocalStorageChanges);

    //   // Cleanup function to remove the event listener when the component unmounts
    //   return () => {
    //     window.removeEventListener("storage", syncLocalStorageChanges);
    //   };
    // }, []);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullNameInput">
          Name:
          <input
            id="fullNameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Species Name:
          <input
            value={speciesName}
            onChange={(e) => setSpeciesName(e.target.value)}
          />
        </label>
        <label>
          Homeworld Name:
          <input
            value={homeworldName}
            onChange={(e) => setHomeworldName(e.target.value)}
          />
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateStarWarsCharactersForm;
