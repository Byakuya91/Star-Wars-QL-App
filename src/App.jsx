import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import CharacterTable from './Components/CharacterTable/CharacterTable';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index/graphql'
  ,
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Star Wars Characters</h1>
        <CharacterTable />
      </div>
    </ApolloProvider>
  );
}

export default App;
