import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import CharacterTable from "./Components/CharacterTable/CharacterTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://swapi-graphql.netlify.app/.netlify/functions/index/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Star Wars Characters</h1>
        <CharacterTable />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </ApolloProvider>
  );
}

export default App;
