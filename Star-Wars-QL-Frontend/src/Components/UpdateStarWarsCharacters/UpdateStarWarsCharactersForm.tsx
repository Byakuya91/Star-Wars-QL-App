import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CHARACTER } from "../Querries/UpdateStarWarsData";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";
import { toast, ToastContainer } from "react-toastify";

// Define types for the character prop
interface CharacterType {
  id: string;
  name: string;
  species?: { name: string };
  homeworld?: { name: string };
}

// Define types for the component props
interface UpdateStarWarsCharactersFormProps {
  character: CharacterType;
  onUpdate?: () => void;
  onClose: () => void;
}

// Define the UpdateStarWarsCharactersForm component
const UpdateStarWarsCharactersForm: React.FC<
  UpdateStarWarsCharactersFormProps
> = ({ character, onUpdate, onClose }) => {
  // State variables to manage the original and updated character details
  const [originalCharacter, setOriginalCharacter] = useState<
    CharacterType | {}
  >({});
  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [homeworld, setHomeworld] = useState<string>("");

  // useMutation hook for the UPDATE_CHARACTER mutation
  const [updateCharacter] = useMutation(UPDATE_CHARACTER, {
    // Handle errors during the mutation
    onError: (error) => {
      console.error("Error updating character:", error);
      toast.error("Error updating character!"); // Display error notification
    },
    // Handle successful completion of the mutation
    onCompleted: (data) => {
      if (data.updateCharacter) {
        toast.success("Character updated successfully!"); // Display success notification
        if (onUpdate) onUpdate(); // Call onUpdate callback if provided
        onClose(); // Call onClose callback
      } else {
        toast.error("Character not found."); // Display error notification if character not found
      }
    },
    // Update the Apollo Client cache after the mutation is successful
    update: (cache, { data: { updateCharacter } }) => {
      try {
        // Read the existing characters from the cache
        const existingData = cache.readQuery<{
          allPeople: { people: CharacterType[] };
        }>({
          query: GET_STAR_WARS_CHARACTERS,
        });

        // Check if the existing data is valid
        if (
          !existingData ||
          !existingData.allPeople ||
          !existingData.allPeople.people
        ) {
          return;
        }

        // Map over the existing characters and update the matching character
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

        // Write the updated characters to the cache
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
        console.error("Error updating cache:", error); // Log error if cache update fails
      }
    },
  });

  // Populate the form fields with the character's existing details when the component mounts
  useEffect(() => {
    if (character) {
      setOriginalCharacter(character);
      setName(character.name || "");
      setSpecies(character.species ? character.species.name : "");
      setHomeworld(character.homeworld ? character.homeworld.name : "");
    }
  }, [character]);

  // Handle form submission to update the character's details
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFields: Partial<CharacterType> = {};

    if (name !== originalCharacter.name) {
      updatedFields.name = name;
    }
    if (
      species !==
      (originalCharacter.species ? originalCharacter.species.name : "")
    ) {
      updatedFields.species = species;
    }
    if (
      homeworld !==
      (originalCharacter.homeworld ? originalCharacter.homeworld.name : "")
    ) {
      updatedFields.homeworld = homeworld;
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.error("No fields have been changed."); // Display error notification if no fields are changed
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
      console.error("Error updating character:", error); // Log error if mutation fails
      toast.error("Error updating character!"); // Display error notification
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
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateStarWarsCharactersForm;
