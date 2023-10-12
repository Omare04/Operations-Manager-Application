import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/layout/Layout";
import styled from "styled-components";
import { Table } from "../../components/content/lists";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { ContentCopy } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, Button } from "@mui/material";
import * as FaIcons from "react-icons/fa";
import axios from "axios";
import { AddStockModal } from "../Modals/MedStockModal";
import {
  AddStockModalEXP,
  AddMaintenanceStockModal,
} from "../Modals/AddStockModal";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr;
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
  grid-row: 2/4;
  grid-column: 1/3;
  overflow-x: auto;
  z-index: 3;

  > * {
    width: 100%;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  grid-column: 1/4;
  grid-row: 1;
  color: white;
  background-image: linear-gradient(to right, #0080ff, #095df0);
  /* border: 1px solid #bebebe; */
  height: 50px;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 0 5px #5757574a;
  z-index: 3;
`;

function MaintenanceStock() {
  const [data, setData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [clickMessage, setClickMessage] = useState("");
  const [clickState, setClickState] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3331/Maintanance_stock", { withCredentials: true })
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((e) => {});
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "part_number",
        header: "P/N",
        size: 150,
        enableClickToCopy: true,
        muiTableBodyCellCopyButtonProps: {
          fullWidth: true,
          startIcon: <ContentCopy />,
          sx: { justifyContent: "flex-start" },
        },
      },
      {
        accessorKey: "product_name",
        header: "Product",
        size: 150,
      },
      {
        accessorKey: "product_type",
        header: "Product Type",
        size: 200,
      },
      {
        accessorKey: "call_sign",
        header: "Call Sign",
        size: 150,
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 150,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        size: 150,
      },
    ],
    []
  );

  const theme = createTheme({
    palette: {
      background: {
        default: "#e9e9e982",
      },
      divider: "#000282",
    },
  });

  const handleClick = () => {};

  return (
    <Grid>
      <StyledHeader> Stock</StyledHeader>
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
            // enableEditing
            initialState={{
              showColumnFilters: true,
              showGlobalFilter: false,
              pagination: { pageSize: 10, pageIndex: 0 },
            }}
            localization={MRT_Localization_EN}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableHiding={false}
            renderTopToolbarCustomActions={({ table }) => (
              <ClickAwayListener onClickAway={handleClick}>
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
                    Add To Stock
                  </Button>
                </Box>
              </ClickAwayListener>
            )}
          />
          <AddMaintenanceStockModal
            open={modal}
            onClose={() => {
              setModal(false);
            }}
          />
        </ThemeProvider>
      </TableWrap>
    </Grid>
  );
}

export default MaintenanceStock;
