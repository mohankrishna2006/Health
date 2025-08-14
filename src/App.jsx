import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
//import React from "react";

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};
export default App;
