import React from "react";

// Define the type for the character prop
interface StarWarsCharacterProps {
  character: {
    name: string;
    species: string;
    homeworld: string;
  };
}

// Refactor the component to TypeScript
const StarWarsCharacter: React.FC<StarWarsCharacterProps> = ({ character }) => {
  return (
    <>
      <td>
        <b>{character.name}</b>
      </td>
      <td>
        <b>{character.species}</b>
      </td>
      <td>
        <b>{character.homeworld}</b>
      </td>
    </>
  );
};

export default StarWarsCharacter;
