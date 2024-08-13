// React imports
import React, { useState, useEffect } from "react";

const IsLoadingError = ({
  children,
  isLoading,
  isError,
  error,
  delay = 10000,
}) => {
  // State variables to track loading and error states
  const [loading, setLoading] = useState(isLoading);
  const [errorState, setErrorState] = useState(isError);
  const [errorMessage, setErrorMessage] = useState(error);

  // TODO: Use Effect to simulate a loading delay when isLoading is true
  useEffect(() => {
    let timer;
    if (isLoading) {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
      }, delay); // TODO: Consider making the delay time configurable
    } else {
      setLoading(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  // TODO: Use effect hook to update error state and message when isError is true
  //? Use effect hook to update error state and message when isError is true
  useEffect(() => {
    if (isError) {
      setErrorState(true);
      if (error.networkError) {
        setErrorMessage(
          "Network error occurred. Please check your connection."
        );
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        setErrorMessage(error.graphQLErrors[0].message);
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    } else {
      setErrorState(false);
    }
  }, [isError, error]); // Consider adding a dependency array to prevent unnecessary re-renders

  // Render loading message if loading state is true
  if (loading) {
    return <p aria-live="polite">Loading...</p>;
  }

  // Render error message if error state is true
  if (errorState) {
    return <p aria-live="assertive">Error: {errorMessage}</p>;
  }

  // Render children if neither loading nor error state is true
  return children;
};

export default IsLoadingError;
