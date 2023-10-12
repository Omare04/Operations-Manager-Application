import Home from "./pages/Home";
import "./Style.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Add from "./pages/Orders/Add";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Plane_list from "./pages/Plane_list";
import Drug_stock from "./pages/Stock/Drug_stock";
import Med_Order from "./pages/Orders/Med_Order";
import Suppliers from "./pages/Suppliers";
import { SignIn } from "./pages/Registration/sign_in";
import { LoginContext } from "./Helper/userContext";
import Header from "./components/layout/Header";
import { useAuthWrapper } from "./Hooks/useAuth";
import MaintenanceStock from "./pages/Stock/MaintenanceStock";
import axios from "axios";
import Cookies from "universal-cookie";
import Layout from "./components/layout/Layout";
import ExitEntryHistory from "./pages/Stock/ExitEntryHistory";
import ViewMedOrders from "./pages/Orders/ViewMedOrders";
import ViewPartOrders from "./pages/Orders/ViewPartOrders";
import ViewPastMedOrders from "./pages/Orders/ViewPastMedOrders";
import ViewPastPartOrders from "./pages/Orders/ViewPastPartOrders";
import PrivateRoutes from "./Helper/privateRoutes";
import Missions from "./pages/Missions/Missions";
import styled from "styled-components";
import MedicalEquipmentStock from "./pages/Stock/MedicalEquipmentStock";
import ExitEntryHistoryEquipment from "./pages/Stock/ExitEntryHistoryEquipment";
import { ProtectedRoutes } from "./Helper/authWrapper";

function App() {

  return (
    <>
      <ProtectedRoutes />
    </>
  );
}

export default App;
