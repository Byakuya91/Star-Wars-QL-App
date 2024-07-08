import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CHARACTER } from "../Querries/UpdateStarWarsData";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { toast, ToastContainer } from "react-toastify";

const UpdateStarWarsCharactersForm = ({ character, onUpdate, onClose }) => {
  // TODO:
  // 1) build the HMTL form and comment it to avoid causing an error(DONE)
  // 2) Code out the pieces of state within the form to correspond to the inputs(DONE)
  // 3) make sure to implement  the useMutation hook to see how it work(ONGOING)
  // 4) code out the submit function for a form.

  //? Define state variables for the character's original and updated details
  const [originalCharacter, setOriginalCharacter] = useState({});
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [homeworld, setHomeworld] = useState("");

  //? Define the updateCharacter mutation with error handling and cache update logic
  const [updateCharacter] = useMutation(UPDATE_CHARACTER, {
    onError: (error) => {
      console.error("Error updating character:", error);
      toast.error("Error updating character!");
    },
    onCompleted: (data) => {
      if (data.updateCharacter) {
        console.log("Character updated successfully!", data);
        toast.success("Character updated successfully!");
        if (typeof onUpdate === "function") onUpdate();
        if (typeof onClose === "function") onClose();
      } else {
        toast.error("Character not found.");
      }
    },
    update: (cache, { data: { updateCharacter } }) => {
      try {
        const existingData = cache.readQuery({
          query: GET_STAR_WARS_CHARACTERS,
        });

        if (
          !existingData ||
          !existingData.allPeople ||
          !existingData.allPeople.people
        ) {
          return;
        }

        const updatedCharacters = existingData.allPeople.people.map((person) =>
          person.id === character.id
            ? {
                ...person,
                name: updateCharacter.name,
                species: { name: updateCharacter.species },
                homeworld: { name: updateCharacter.homeworld },
              }
            : person
        );

        cache.writeQuery({
          query: GET_STAR_WARS_CHARACTERS,
          data: {
            allPeople: {
              ...existingData.allPeople,
              people: updatedCharacters,
            },
          },
        });
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
  });

  //? Populate the form fields with the character's existing details when the component mounts
  useEffect(() => {
    if (character) {
      setOriginalCharacter(character);
      setName(character.name || "");
      setSpecies(character.species ? character.species.name : "");
      setHomeworld(character.homeworld ? character.homeworld.name : "");
    }
  }, [character]);

  //? Handle form submission to update the character's details
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};

    if (name !== originalCharacter.name) {
      updatedFields.name = name;
      console.log("The name has been changed to:", updatedFields.name);
      // toast.success("Name has been changed!");
    }
    if (
      species !==
      (originalCharacter.species ? originalCharacter.species.name : "")
    ) {
      updatedFields.species = species;
      console.log("The species has been changed to:", updatedFields.species);
      // toast.success("Species has been changed!");
    }
    if (
      homeworld !==
      (originalCharacter.homeworld ? originalCharacter.homeworld.name : "")
    ) {
      updatedFields.homeworld = homeworld;
      console.log(
        "The homeworld has been changed to:",
        updatedFields.homeworld
      );
      // toast.success("Homeworld has been changed!");
    }

    if (Object.keys(updatedFields).length === 0) {
      // toast.error("No fields have been changed.");
      return;
    }

    try {
      await updateCharacter({
        variables: {
          id: character.id,
          ...updatedFields,
        },
      });
    } catch (error) {
      console.error("Error updating character:", error);
      toast.error("Error updating character!");
    }
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
          />
        </label>
        <label>
          Species Name:
          <input value={species} onChange={(e) => setSpecies(e.target.value)} />
        </label>
        <label>
          Homeworld Name:
          <input
            value={homeworld}
            onChange={(e) => setHomeworld(e.target.value)}
          />
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateStarWarsCharactersForm;
