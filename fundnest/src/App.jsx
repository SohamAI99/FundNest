import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
