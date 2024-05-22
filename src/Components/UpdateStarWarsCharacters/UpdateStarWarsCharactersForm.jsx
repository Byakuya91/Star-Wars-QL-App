import React, { useState } from "react";

// ? third party imports
import { useMutation } from '@apollo/client';

// !TODO: Code out the form. 
const UpdateStarWarsCharactersForm = ({character, onUpdate, onClose}) => {
// TODO:
// 1) build the HMTL form and comment it to avoid causing an error
// 2) Code out the pieces of state within the form to correspond to the inputs
// 3) make sure to implmenet the useMutation hook to see how it works.
// 4) code out the submit function for a form.

// ? State variables
// const [name, setName] = useState(character.name ? character.name: '');
//   const [speciesName, setSpeciesName] = useState(character.species ? character.species.name : '');
//   const [homeworldName, setHomeworldName] = useState(character.homeworld ? character.homeworld.name :'');


  return (
    <div>Test placeholder for Form </div>
    // ! HTML for the form, filling out the pieces of state 
    // <div className="modal">
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       Name:
    //       <input value={name} onChange={(e) => setName(e.target.value)} />
    //     </label>
    //     <label>
    //       Species:
    //       <input value={speciesName} onChange={(e) => setSpeciesName(e.target.value)} />
    //     </label>
    //     <label>
    //       Homeworld:
    //       <input value={homeworldName} onChange={(e) => setHomeworldName(e.target.value)} />
    //     </label>
    //     <button type="submit">Update</button>
    //     <button type="button" onClick={onClose}>Cancel</button>
    //   </form>
    // </div>
  );
};

export default UpdateStarWarsCharactersForm;
