// TODO: Setup the resolvers to display the data I have.

const characters = require("../data/characters");

const resolvers = {
  Query: {
    allPeople: () => characters,
  },
};

module.exports = resolvers;
