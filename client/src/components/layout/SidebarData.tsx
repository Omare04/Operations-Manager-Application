import React from "react";
import * as FaIcons from "react-icons/fa";
import MaintenanceStock from "../../pages/Stock/MaintenanceStock";

//Index indentifies the order of mapping for each object.
export const SidebarDataMaintenance = [
  {
    title: "Maintenance Stock",
    icon: <FaIcons.FaTools />,
    route: "/pages/Stock/MaintenanceStock",
    arrow: <FaIcons.FaAngleDown />,
    index: 0,
  },
  {
    title: "Planes",
    icon: <FaIcons.FaPlane />,
    route: "/pages/Plane_List",
    index: 1,
  },
  {
    title: "Suppliers",
    icon: <FaIcons.FaTruck />,
    index: 1,
    route: "/pages/Suppliers",
    arrow: <FaIcons.FaAngleDown />,
  },
  {
    title: "Maintenance Orders",
    icon: <FaIcons.FaClipboardList />,
    arrow: <FaIcons.FaAngleDown />,
    Submenu: [
      {
        title: "Create An Order",
        route: "/pages/Orders/Add",
        icon: <FaIcons.FaCartPlus />,
      },
      {
        title: "View Active Orders",
        route: "/pages/Orders/ViewPartOrders",
        icon: <FaIcons.FaEye />,
        index: 1,
      },
      {
        title: "View Past Orders",
        route: "/pages/Orders/ViewPastPartOrders",
        icon: <FaIcons.FaEye />,
        index: 1,
      },
    ],
  },
];

export const MedicalSidebarData = [
  {
    title: "Medical Stock",
    icon: <FaIcons.FaMedkit />,
    arrow: <FaIcons.FaAngleDown />,
    index: 0, // Add the index property to identify the item
    Submenu: [
      {
        title: "View Drugs",
        route: "/pages/Stock/Drug_stock",
        icon: <FaIcons.FaEye />,
      },
      {
        title: "View Medical Equipment ",
        route: "/pages/Stock/MedicalEquipmentStock",
        icon: <FaIcons.FaTools />,
      },
      {
        title: "Drug E/R History",
        route: "/pages/Stock/ExitEntryHistory",
        icon: <FaIcons.FaHistory />,
      },
      {
        title: "Equipment E/R History",
        route: "/pages/Stock/ExitEntryHistoryEquipment",
        icon: <FaIcons.FaHistory />,
      },
    ],
  },
  {
    title: "Medical Orders",
    icon: <FaIcons.FaClipboardList />,
    arrow: <FaIcons.FaAngleDown />,
    Submenu: [
      {
        title: "Create An Order",
        route: "/pages/Orders/Med_Order",
        icon: <FaIcons.FaCartPlus />,
        index: 1,
      },
      {
        title: "View Active Orders",
        route: "/pages/Orders/ViewMedOrders",
        icon: <FaIcons.FaEye />,
        index: 1,
      },
      {
        title: "View Past Orders",
        route: "/pages/Orders/ViewPastMedOrders",
        icon: <FaIcons.FaEye />,
        index: 1,
      },
    ],
  },
  {
    title: "Missions",
    icon: <FaIcons.FaPlaneDeparture />,
    route: "/pages/Missions/Missions",
  },
];
