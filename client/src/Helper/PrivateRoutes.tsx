import React from "react";
import { Outlet } from "react-router-dom";
import { CheckLogin } from "../Hooks/useAuth";

//The parent component that encapsulates its children, and only allows authenticated users access to its children.

function PrivateRoutes() {
  //Authenticate the JWT token using HTTP only cookie method.
  return CheckLogin()
    .promise.then((result) => {
      //render the child elements being the App if the user is authenticated.
      result ? <Outlet /> : null;
    })
    .catch((err) => {
      null;
    });
}

export default PrivateRoutes;
