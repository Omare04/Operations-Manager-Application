import "./Style.css";
import React from "react";
import { ProtectedRoutes } from "./Helper/authWrapper";

function App() {

  return (
    <>
      <ProtectedRoutes />
    </>
  );
}

export default App;
