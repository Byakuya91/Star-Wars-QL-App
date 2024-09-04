import React, { useState, useEffect, ReactNode } from "react";

// Define types for the error object
interface GraphQLError {
  message: string;
}

interface NetworkError {
  message: string;
}

interface ErrorType {
  networkError?: NetworkError;
  graphQLErrors?: GraphQLError[];
}

// Define the props interface for IsLoadingError
interface IsLoadingErrorProps {
  children: ReactNode;
  isLoading: boolean;
  isError: boolean;
  error: ErrorType | null;
  delay?: number; // Optional prop with a default value
}

const IsLoadingError: React.FC<IsLoadingErrorProps> = ({
  children,
  isLoading,
  isError,
  error,
  delay = 10000,
}) => {
  // State variables to track loading and error states
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [errorState, setErrorState] = useState<boolean>(isError);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    error ? "" : null
  );

  // Use Effect to simulate a loading delay when isLoading is true
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isLoading) {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
      }, delay);
    } else {
      setLoading(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, delay]);

  // Use effect hook to update error state and message when isError is true
  useEffect(() => {
    if (isError && error) {
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
      setErrorMessage(null);
    }
  }, [isError, error]);

  // Render loading message if loading state is true
  if (loading) {
    return <p aria-live="polite">Loading...</p>;
  }

  // Render error message if error state is true
  if (errorState && errorMessage) {
    return <p aria-live="assertive">Error: {errorMessage}</p>;
  }

  // Render children if neither loading nor error state is true
  return <>{children}</>;
};

export default IsLoadingError;
