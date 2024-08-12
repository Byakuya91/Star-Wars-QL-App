// React imports
import React, { useState, useEffect } from "react";

const IsLoadingError = ({ children, isLoading, isError, error }) => {
  //   ?State variables to track loading and error states
  const [loading, setLoading] = useState(isLoading);
  const [errorState, setErrorState] = useState(isError);
  const [errorMessage, setErrorMessage] = useState(error);

  //  TODO: Use Effect to simulate a loading delay when isLoading is true(DONE)
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      // Simulate a loading delay
      setTimeout(() => {
        setLoading(false);
      }, 2000); //TODO: consider making the delay time configurable.
    }
  }, [isLoading]);

  //TODO: Use effect hook to update error state and message when isError is true(DONE)
  useEffect(() => {
    if (isError) {
      setErrorState(true);
      setErrorMessage(error);
    }
  }, [isError, error]); // TODO: Consider adding a dependency array to prevent unnecessary re-renders

  // Render loading message if loading state is true
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render error message if error state is true
  if (errorState) {
    return <p>Error: {errorMessage}</p>;
  }

  // Render children if neither loading nor error state is true
  return children;
};

export default IsLoadingError;
