import { Schema, model, Document } from "mongoose";

// ?Define an interface, representing the MongoDB character document.
export interface ICharacter extends Document {
  name: string;
  species?: string;
  homeworld?: string;
  createdAt: Date;
  updatedAt: Date;
}

const characterSchema = new Schema<ICharacter>(
  {
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: false,
    },
    homeworld: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Character = model<ICharacter>("Character", characterSchema);

export default Character;
