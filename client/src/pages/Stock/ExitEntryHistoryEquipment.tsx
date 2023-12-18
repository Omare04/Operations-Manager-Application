import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "../../components/content/lists";
import {
  DropDownCompStatic,
  ExportTable,
} from "../../components/content/Input_components";
import axios from "axios";
import { downloadPdf } from "../../Helper/downLoadFunction";
import { MaterialReactTable } from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2261e9dc;
  grid-column: 1/4;
  grid-row: 1;
  color: white;
  background-image: linear-gradient(to right, #0080ff, #095df0);
  border: 1px solid #bebebe;
  height: 50px;
  border-radius: 5px;
  box-shadow: 0 0 5px #5757574a;
`;

const TableWrap = styled.div`
  display: grid;
  grid-row: 2/3;
  grid-column: 1/4;
`;

const StyledExportWrap = styled.div`
  display: flex;
  align-items: center;
  width: 99%;
  grid-column: 1/4;
  grid-row: 3;
  padding-top: 17px;
  height: 35px;
`;

export default function ExitEntryHistoryEquipment() {
  const [data, setData] = useState([{}]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3331/MedicalEquipmentStock/ERHistory", {withCredentials: true})
      .then((result) => {
        setData(result.data);
      });
  }, []);

  const columns = [
    {
      accessorKey: "fname",
      header: "First Name",
      size: 40,
    },
    {
      accessorKey: "lname",
      header: "Last Name",
      size: 40,
    },
    {
      accessorKey: "product_name",
      header: "Product Name",
      size: 60,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      size: 20,
    },
    {
      accessorKey: "type",
      header: "Type",
      size: 40,
    },
    {
      accessorKey: "flight_num",
      header: "Flight NO",
      size: 40,
    },
    {
      accessorKey: "FormattedDate",
      header: "Added At",
      size: 80,
    },
  ];

  //Future, export removals and entries of the stock.
  const handleExport = (type) => {
    setLoading(true);
    const user = [
      {
        email: "t.elmasaoudi@gmail.com",
        phoneNumber: "+212 6 61 50 67 83",
        fname: "Tarik",
        lname: "El masaoudi",
      },
    ];

    axios
      .get(`http://localhost:3331/Med_stock/EntryExit/${type}`, {withCredentials: true})
      .then((res) => {
        axios
          .get("http://localhost:3331/Services/generateTableRoute/EntryExit", {
            params: {
              type: type,
              td: res.data.payload,
              headers:
                type === "Enter"
                  ? ["Product", "Type", "Quantity", "Date Entered"]
                  : ["Product", "Type", "Quantity", "Mission", "Date Removed"],
              user: user,
              columnWidths:
                type === "Enter"
                  ? [150, 150, 50, 200]
                  : [150, 150, 50, 100, 200],
              title:
                type == "Enter"
                  ? "Medical Stock Entries"
                  : "Medical Stock Removals",
            },
            responseType: "blob",
            withCredentials: true
          })
          .then((pdf) => {
            if (type == "Remove") {
              downloadPdf("StockRemovalHistory", pdf.data);
            } else {
              downloadPdf("StockEntryHistory", pdf.data);
            }
            setLoading(false);
          })
          .catch((e) => {
            alert("Error Generating PDF");
          });
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  return (
    <>
      <Grid>
        <StyledHeader> Medical Equipment Entry/Exit History</StyledHeader>
        <TableWrap>
          <MaterialReactTable
            columns={columns}
            data={data}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableHiding={false}
            positionToolbarAlertBanner="bottom"
            // renderTopToolbarCustomActions={({ table }) => (
            //   <Box
            //     sx={{
            //       display: "flex",
            //       gap: "1rem",
            //       p: "0.5rem",
            //       flexWrap: "wrap",
            //     }}
            //   >
            //     <Button
            //       color="primary"
            //       startIcon={<FileDownloadIcon />}
            //       variant="contained"
            //       onClick={() => {
            //         handleExport("Enter");
            //       }}
            //     >
            //       Export Stock Entries
            //     </Button>
            //     <Button
            //       startIcon={<FileDownloadIcon />}
            //       variant="contained"
            //       onClick={() => {
            //         handleExport("Remove");
            //       }}
            //     >
            //       Export Stock Removals
            //     </Button>
            //   </Box>
            // )}
          />
        </TableWrap>
      </Grid>
    </>
  );
}
