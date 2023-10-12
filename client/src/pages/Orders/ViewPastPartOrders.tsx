import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import { OrderTable, Table } from "../../components/content/lists";
import { downloadPdf } from "../../Helper/downLoadFunction";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
`;

const TableWrap = styled.div`
  display: grid;
  grid-row: 2/3;
  grid-column: 1/7;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  grid-column: 1/7;
  grid-row: 1;
  color: white;
  background-image: linear-gradient(to right, #0080ff , #095df0);
  border: 1px solid #bebebe;
  height: 50px;
  border-radius: 5px;
  box-shadow: 0 0 5px #5757574a;
`;

export default function ViewPastMedOrders() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  //An Array that holds one or more orders that are arrays of objects
  const [rowSelection, setRowSelection] = useState({});
  const tableInstanceRef = useRef();
  const [clickMessage, setClickMessage] = useState("");
  const [clickState, setClickState] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3331/Orders/PastPartOrders", {withCredentials: true})
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((e) => {});
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "PO",
        header: "PO",
        size: 150,
      },
      {
        accessorKey: "active",
        header: "status",
        size: 150,
      },
      {
        accessorKey: "product_name",
        header: "Product",
        size: 150,
      },
      {
        accessorKey: "product_type",
        header: "Product Type",
        size: 150,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        size: 70,
      },
      {
        accessorKey: "FormattedDate",
        header: "Date Delivered",
        size: 190,
      },
    ],
    []
  );

  const handlePdfExport = () => {
    setClickState(true);
    const rowSelection = tableInstanceRef.current.getState().rowSelection;
    const user = [
      {
        email: "clinicalmanager@airocean.ma",
        phoneNumber: "+212668782690",
        fname: "Reda",
        lname: "",
      },
    ];

    if (Object.keys(rowSelection).length > 0) {
      for (let i = 0; i < Object.keys(rowSelection).length; i++) {
        axios
          .get(
            `http://localhost:3331/Orders/ExportPartPO/${
              Object.keys(rowSelection)[i]
            }`, {withCredentials: true}
          )
          .then((result) => {
            if (result.data && result.data.length > 0) {
              axios
                .get("http://localhost:3331/Services/exportPoPdf", {
                  params: {
                    orderDetails: result.data,
                    user: user,
                    Supplier: {
                      Supplier: result.data[0].Supplier,
                      email: result.data[0].supplier_Email,
                      PhoneNumber: result.data[0].supplier_phoneNumber,
                      address: result.data[0].address,
                      Country: result.data[0].Country,
                    },
                  },
                  responseType: "blob",
                  withCredentials: true
                })
                .then((result2) => {
                  downloadPdf(result.data[0].PO, result2.data);
                  setClickMessage("Download Successful");

                  setTimeout(() => setClickState(false), 3000);
                })
                .catch((e) => {
                  alert(e);
                });
            } else {
              console.log("No data found in the API response.");
            }
          });
      }
    } else {
      setClickMessage("Please Select An Order(s) To Export");
      setTimeout(() => setClickState(false), 2000);
    }
  };

  const theme = createTheme({
    palette: {
      background: {
        default: "#e9e9e982",
        // Change to your desired background color
      },
      divider: "#000282",
    },
  });

  const handleClick = () => {};

  function getColor() {
    if (clickMessage == "Please Select An Order(s) To Export") {
      return "red";
    } else {
      return "green";
    }
  }

  const styles = {
    position: "flex",
    width: "300",
    border: "1px solid #e8e8e8",
    p: 1,
    bgcolor: "#f4f4f4",
    color: getColor(),
  };

  return (
    <>
      <Grid>
        <StyledHeader>
          {" "}
          Past Orders <FaIcons.FaCartArrowDown
            style={{ paddingLeft: "5px" }}
          />{" "}
        </StyledHeader>
        <TableWrap>
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={data ?? []}
              state={{ isLoading: loading, rowSelection }}
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
              initialState={{
                showColumnFilters: true,
                showGlobalFilter: false,
              }}
              localization={MRT_Localization_EN}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              enableHiding={false}
              enableRowSelection
              tableInstanceRef={tableInstanceRef}
              getRowId={(row) => row.PO}
              onRowSelectionChange={setRowSelection}
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
                    {clickState ? <Box sx={styles}>{clickMessage}</Box> : null}
                    <Button
                      color="primary"
                      startIcon={<FileDownloadIcon />}
                      variant="contained"
                      onClick={() => {
                        handlePdfExport();
                      }}
                    >
                      Export
                    </Button>
                  </Box>
                </ClickAwayListener>
              )}
            />
          </ThemeProvider>
        </TableWrap>
      </Grid>
    </>
  );
}
