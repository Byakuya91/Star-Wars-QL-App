// React and Apollo imports
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";

//? Query imports
import { ADD_STAR_WARS_CHARACTER } from "../Querries/AddStarWarsCharacter";
import { GET_STAR_WARS_CHARACTERS } from "../Querries/StarWarsNames";

//? Define the StarWarsCharacterForm component
const StarWarsCharacterForm = () => {
  // State variables for managing form input values
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    homeworld: "",
  });

  // useMutation hook for the ADD_STAR_WARS_CHARACTER mutation
  const [addStarWarsCharacter] = useMutation(ADD_STAR_WARS_CHARACTER, {
    update(cache, { data: { addCharacter } }) {
      const { allPeople } = cache.readQuery({
        query: GET_STAR_WARS_CHARACTERS,
      }) || { allPeople: [] };

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
      setFormData({ name: "", species: "", homeworld: "" });
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
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
      <ToastContainer />
    </div>
  );
};

export default StarWarsCharacterForm;
