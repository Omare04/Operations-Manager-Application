import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import * as FaIcons from "react-icons/fa";
import { IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  ViewMissionModalSummary,
  ViewPastMissionModalSummary,
} from "../Modals/AddStockModal";
import { useAsync } from "react-select/async";

const StyledTableWrapper = styled.div`
  overflow-y: auto;
  border-collapse: collapse;
  height: 275px;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  height: 270px;
  background-color: #dadada;
  overflow: auto;
  border-spacing: 0px;
`;

const StyledTableRows = styled.tr`
  background-image: linear-gradient(to right, #f5f5f5, #e5e5e5);
  border-radius: 10px;
  width: 100%;
  transition: background-image 0.6s ease-in-out;

  &:hover {
    background-image: linear-gradient(to right, #ebebeb, #e5e5e5);
  }
`;

const StyledTableHeaders = styled.th`
  display: flex;
  justify-content: flex-start;
  font-size: 15px;
  padding-left: 15px;
  padding-top: 9px;
  padding-bottom: 9px;
  color: #414141;
  background-color: #f4f4f4;
  position: sticky;
  top: 0;
`;

const StyledTableItems = styled.td`
  /* border-radius: 10px; */
  padding: 15px;
  display: flex;
  justify-content: space-between;
`;

const StyledEllipsis = styled.div`
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #515151;
  }
`;

const TableWrap = styled.div`
  padding: 5px;
  overflow: auto;
  padding-bottom: 5px;
`;

const StyledNoTableItemsMessage = styled.div`
  color: #a9a9a9;
  font-style: italic; 
  display: flex;
  align-items: center;
  font-size: 30px;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export function ActiveMissionList() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState({});

  const handleOpenModal = (index) => {
    setModalOpen({ ...modalOpen, [index]: true });
  };

  const handleCloseModal = (index) => {
    setModalOpen({ ...modalOpen, [index]: false });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3331/Missions/Active")
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        // Handle the error.
      });
  }, []);

  return (
    <>
      <StyledTableWrapper>
        {data.length === 0 ? (
          <StyledNoTableItemsMessage>
            No Active Missions
          </StyledNoTableItemsMessage>
        ) : (
          <StyledTable>
            <StyledTableHeaders> Mission Number</StyledTableHeaders>
            {data.map((value, index) => (
              <StyledTableRows key={index}>
                <StyledTableItems>
                  {value.parsedData.flightInfo.flightNumber} (
                  {value.parsedData.flightInfo.date})
                  <StyledEllipsis>
                    <FaIcons.FaEllipsisH
                      onClick={() => handleOpenModal(index)}
                    />
                    <ViewMissionModalSummary
                      openModal={modalOpen[index] || false}
                      data={data[index].parsedData}
                      id={data[index].id}
                      onClose={() => handleCloseModal(index)}
                      active={true}
                    />
                  </StyledEllipsis>
                </StyledTableItems>
              </StyledTableRows>
            ))}
          </StyledTable>
        )}
      </StyledTableWrapper>
    </>
  );
}

export function PastMissionsList() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState({});

  const handleOpenModal = (index) => {
    setModalOpen({ ...modalOpen, [index]: true });
  };

  const handleCloseModal = (index) => {
    setModalOpen({ ...modalOpen, [index]: false });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3331/Missions")
      .then((result) => {
        setLoading(!loading);
        setData(result.data);
      })
      .catch((e) => {});
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "flightInfo.flightNumber",
        header: "Flight NO",
        size: 150,
      },
      {
        accessorKey: "flightInfo.date",
        header: "Date",
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
  return (
    <>
      <TableWrap>
        <ThemeProvider theme={theme}>
          <MaterialReactTable
            columns={columns}
            data={data}
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
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  p: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                Add Supplier
              </Box>
            )}
            initialState={{ showColumnFilters: false, showGlobalFilter: false }}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableHiding={false}
            enableRowActions={true}
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
                  onClick={() => handleOpenModal(row.index)}
                >
                  <FaIcons.FaEye />
                </IconButton>
                <ViewPastMissionModalSummary
                  openModal={modalOpen[row.index] || false}
                  data={row.original}
                  id={row.original.id}
                  onClose={() => handleCloseModal(row.index)}
                  active={true}
                />
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
                ></Box>
              </ClickAwayListener>
            )}
          />
        </ThemeProvider>
      </TableWrap>
    </>
  );
}

const StyledListTable = styled.table`
  overflow-y: auto;
  border-collapse: collapse;
  background-image: linear-gradient(to right, #f7f7f7, #e6e6e6);
  border: 1px solid rgb(194, 194, 194);
  max-height: 100px;
  height: 100px;
  width: 100%;
`;

const StyledTableContainer = styled.div`
  overflow-y: auto;
  border-collapse: collapse;
  max-height: 134px;
  width: 100%;
`;

const StyledListTableItems = styled.tr`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  width: 100%;
  background-color: #f1f1f1;
  cursor: pointer;
`;

const StyledListTd = styled.td`
  border-radius: 3px;
  width: 100%;
  gap: 4px;
  color: #464646;
  padding: 12px;
`;

const StyledAngleDownWrapper = styled.div`
  padding-right: 15px;
`;

const StyledAngleDown = styled(FaIcons.FaAngleDown)`
  color: #393939;
  font-size: 19px;

  &:hover {
    transition: color 0.2s ease-in-out;
    color: #636363;
  }
`;
const StyledAngleUp = styled(FaIcons.FaAngleUp)`
  color: #393939;
  font-size: 19px;

  &:hover {
    transition: color 0.2s ease-in-out;
    color: #636363;
  }
`;

export function MissionSummaryToggleList({ data }) {
  const [index, setIndex] = useState(null);

  const toggleSubMenu = (clickedIndex) => {
    if (index === clickedIndex) {
      setIndex(null);
    } else {
      setIndex(clickedIndex);
    }
  };

  return (
    <>
      <StyledTableContainer>
        <StyledListTable>
          <StyledListTableItems onClick={() => toggleSubMenu(1)}>
            <StyledListTd>Medical Equipment</StyledListTd>
            <StyledAngleDownWrapper>
              {index === 1 ? <StyledAngleUp /> : <StyledAngleDown />}
            </StyledAngleDownWrapper>
          </StyledListTableItems>
          {index === 1
            ? data.equipment.map((values) => (
                <StyledListTableItems
                  key={values}
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <StyledListTd>{values.name}</StyledListTd>
                  Qty:
                  <span style={{ paddingRight: "12px" }}> {values.qty}</span>
                </StyledListTableItems>
              ))
            : null}
          <StyledListTableItems onClick={() => toggleSubMenu(2)}>
            <StyledListTd>Drugs</StyledListTd>
            <StyledAngleDownWrapper>
              {index === 2 ? <StyledAngleUp /> : <StyledAngleDown />}
            </StyledAngleDownWrapper>
          </StyledListTableItems>
          {index === 2
            ? data.drugs.map((values) => (
                <StyledListTableItems
                  key={values}
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <StyledListTd>{values.name}</StyledListTd>
                  Qty:
                  <span style={{ paddingRight: "12px" }}> {values.qty}</span>
                </StyledListTableItems>
              ))
            : null}
          <StyledListTableItems onClick={() => toggleSubMenu(3)}>
            <StyledListTd>Crew</StyledListTd>
            <StyledAngleDownWrapper>
              {index === 3 ? <StyledAngleUp /> : <StyledAngleDown />}
            </StyledAngleDownWrapper>
          </StyledListTableItems>
          {index === 3
            ? data.personele.map((values) => (
                <StyledListTableItems
                  key={values}
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <StyledListTd>{values.name}</StyledListTd>
                </StyledListTableItems>
              ))
            : null}
        </StyledListTable>
      </StyledTableContainer>
    </>
  );
}
