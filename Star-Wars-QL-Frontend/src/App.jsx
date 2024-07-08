import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import CharacterTable from "./Components/CharacterTable/CharacterTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Apollo Client
const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    fetchOptions: {
      mode: "cors", // Enable CORS if required
    },
  }),
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  },
});

const testToast = () => {
  toast.success("Toastify is working!");
};

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Star Wars Characters</h1>
        <CharacterTable />
        <button onClick={testToast}>Test Toast</button>
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
