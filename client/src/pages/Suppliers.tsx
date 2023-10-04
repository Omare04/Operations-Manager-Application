import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import styled from "styled-components";
import { Table } from "../components/content/lists";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { ContentCopy } from "@mui/icons-material";
import * as FaIcons from "react-icons/fa";
import axios from "axios";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, Button } from "@mui/material";
import { AddSupplier } from "./Modals/AddStockModal";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
  z-index: 3;
`;

const TableWrap = styled.div`
  display: grid;
  grid-row: 2/3;
  grid-column: 1/4;
  z-index: 3;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  grid-column: 1/4;
  grid-row: 1;
  color: white;
  background-image: linear-gradient(to right, #0080ff , #095df0);
  /* border: 1px solid #bebebe; */
  height: 50px;
  font-weight: bold;  
  border-radius: 5px;
  box-shadow: 0 0 5px #5757574a;
  z-index: 3;
`;

function Suppliers() {
  const [data, setData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [clickMessage, setClickMessage] = useState("");
  const [clickState, setClickState] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3331/Supplier")
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((e) => {});
  }, []);

  const theme = createTheme({
    palette: {
      background: {
        default: "#e9e9e982",
      },
      divider: "#000282",
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "Supplier",
        header: "Supplier",
        size: 150,
      },
      {
        accessorKey: "Country",
        header: "Country",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
        enableClickToCopy: true,
        muiTableBodyCellCopyButtonProps: {
          fullWidth: true,
          startIcon: <ContentCopy />,
          sx: { justifyContent: "flex-start" },
        },
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 150,
      },
      {
        accessorKey: "PhoneNumber",
        header: "Phone Number",
        size: 150,
      },
    ],
    []
  );

  return (
    <Grid>
      <StyledHeader> List Of Suppliers</StyledHeader>
      <TableWrap>
        <ThemeProvider theme={theme}>
          <MaterialReactTable
            columns={columns}
            data={data ?? []}
            state={{ isLoading: loading }}
            muiTableBodyProps={{
              sx: {
                "& tr:nth-of-type(odd)": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                borderRight: "2px solid #ecececb6",
              },
            }}
            initialState={{ showColumnFilters: true, showGlobalFilter: false }}
            localization={MRT_Localization_EN}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableHiding={false}
            enableRowActions
            renderRowActions={({ row, table }) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: "2px",
                  justifyContent: "flex-start",
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() =>
                    window.open(
                      `https://mail.google.com/mail/u/0/?view=cm&to=${row.original.email}`
                    )
                  }
                >
                  <EmailIcon />
                </IconButton>
              </Box>
            )}
            renderTopToolbarCustomActions={({ table }) => (
              <ClickAwayListener onClickAway={() => {}}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    p: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {clickState ? <Box>{clickMessage}</Box> : null}
                  <Button
                    color="primary"
                    startIcon={<FaIcons.FaPlus />}
                    variant="contained"
                    onClick={() => {
                      setModal(!modal);
                    }}
                  >
                    Add Supplier
                  </Button>
                </Box>
              </ClickAwayListener>
            )}
          />
          <AddSupplier
            open={modal}
            onClose={() => {
              setModal(!modal);
            }}
          />
        </ThemeProvider>
      </TableWrap>
    </Grid>
  );
}

const StyledGraphWrapper = styled.div`
  grid-column: 1/4;
  grid-row: 2/3;
  padding: 15px;
`;
export function SupplierStatsGraph() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    axios
      .get("http://localhost:3331/Supplier/SupplierStats/28")
      .then((result) => {
        setData(result.data);
      })
      .catch((e) => {});
  }, []);

  return (
    <StyledGraphWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={400} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="supplier" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="supplierCount" name="Number Of Orders" fill="#3d5bd5" />
        </BarChart>
      </ResponsiveContainer>
    </StyledGraphWrapper>
  );
}

export default Suppliers;
