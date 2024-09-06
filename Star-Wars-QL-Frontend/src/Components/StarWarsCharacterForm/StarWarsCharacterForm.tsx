// React and Apollo imports
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

// Query imports
import { ADD_STAR_WARS_CHARACTER } from "../Querries/AddStarWarsCharacter";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

// StarWarsCharacterFormProps: props for the form component
interface StarWarsCharacterFormProps {
  handleAddStarWarsCharacterFormClose: () => void;
}

// Define the generic form data interface
interface FormData {
  name: string;
  species: string;
  homeworld: string;
}

// Generic StarWarsCharacterForm component that accepts any type of form data
const StarWarsCharacterForm = <T extends FormData>({
  handleAddStarWarsCharacterFormClose,
}: StarWarsCharacterFormProps) => {
  // State variables for managing form input values
  const [formData, setFormData] = useState<T>({
    name: "",
    species: "",
    homeworld: "",
  } as T); // Initialize formData with generic type T

  // useMutation hook for the ADD_STAR_WARS_CHARACTER mutation
  const [addStarWarsCharacter] = useMutation(ADD_STAR_WARS_CHARACTER, {
    update(cache, { data: { addCharacter } }) {
      // Using generic type T for the Apollo cache query
      const { allPeople } = cache.readQuery<{ allPeople: T[] }>({
        query: GET_STAR_WARS_CHARACTERS,
      }) || { allPeople: [] };

      // Updating the Apollo cache with the newly added character
      cache.writeQuery({
        query: GET_STAR_WARS_CHARACTERS,
        data: {
          allPeople: [...allPeople, addCharacter],
        },
      });
    },
    onError: (error) => {
      console.error("Error adding character:", error);
      toast.error("Error adding character!");
    },
    onCompleted: () => {
      toast.success("New Character added!");
      setFormData({ name: "", species: "", homeworld: "" } as T); // Reset form data
      handleAddStarWarsCharacterFormClose(); // Close the modal
    },
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Updating form data state
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, species, homeworld } = formData;
    try {
      await addStarWarsCharacter({
        variables: { name, species, homeworld },
      });
    } catch (error) {
      console.error("Error adding character:", error);
      toast.error("Error adding character!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nameInput">
          Name:
          <input
            id="nameInput"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="speciesInput">
          Species Name:
          <input
            id="speciesInput"
            name="species"
            value={formData.species}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="homeworldInput">
          Homeworld Name:
          <input
            id="homeworldInput"
            name="homeworld"
            value={formData.homeworld}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StarWarsCharacterForm;
