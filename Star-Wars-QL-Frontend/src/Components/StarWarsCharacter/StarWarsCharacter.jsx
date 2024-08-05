import React from "react";

// TODO: create a separate component to display the character's name, species and homeworld.
const StarWarsCharacter = ({ character }) => {
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
