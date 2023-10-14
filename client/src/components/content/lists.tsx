import React, { useEffect, useState, useContext } from "react";
import * as FaIcons from "react-icons/fa";
import { FaAngleDown, FaSearch, FaXing } from "react-icons/fa";
import styled from "styled-components";
import { Fetch } from "../../Fetch";
import { ActiveOrderData, Medlistdata, MedOrderTableData } from "./listdata";
import {
  DropDownComp,
  DropDownCompStatic,
  FilterDropDownComp,
  ExportTable,
} from "./Input_components";
import { json } from "react-router-dom";
import { ActiveOrderContext } from "./HomeBoxes";
import MedStockModal, {
  AddStockModal,
  MedOrderModal,
  OrderUpdateModal,
} from "../../pages/Modals/MedStockModal";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import { AddToStock } from "./Input_components";
import {
  AddStockModalEXP,
  EditOrderModal,
} from "../../pages/Modals/AddStockModal";

const Styledtbody = styled.tbody``;

const StyledTableContainer = styled.div`
  overflow-y: auto;
  border-collapse: collapse;
  grid-column: 1/6;
  grid-row: 2/3;
`;

const StyledTable = styled.table`
  overflow: auto;
  background-color: #dddddd;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 400px;
  grid-column: 1/6;
  border-collapse: collapse;
  width: 100%;
`;

const StyledTableRows = styled.tr`
  align-items: center;
  justify-content: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  transition: background-color 0.1s ease-in-out;
  cursor: pointer;

  background-color: #ffffff;
`;

const StyledTableHeading = styled.th`
  position: sticky;
  top: 0;
  background-color: #eeeeee;
  z-index: 2;
  font-size: 14px;
  color: #3b3b3b;
  text-align: start;
  padding-left: 21px;
  padding-bottom: 10px;
  padding-top: 10px;
  visibility: ${(props) => (props.hide ? "hidden" : "visible")};
`;

const StyledTableData = styled.td`
  padding-top: 12px;
  padding: 21px;
  font-size: 13px;
  padding-bottom: 17px;
`;

const StyledArrowDown = styled.div`
  cursor: pointer;
  transition: color 0.2s ease;
  text-align: center;
  transition: background-color 0.2s ease;
  font-size: 16px;
  color: #000000;
  &:hover {
    color: #8d8d8d;
  }

  &:active {
    color: #0c23b7;
  }
`;

const StyledFilterContainer = styled.div`
  display: flex;
  /* grid-template-columns: 40px 0.5fr 0.5fr 115px; */
  grid-column: 1/6;
  grid-row: 1;
  margin-bottom: 10px;
  height: 40px;
`;

const StyledSearchBox = styled.div`
  /* display: grid; */
  height: 100%;
  display: flex;
  width: 100%;
  /* border-right: 1px solid #cfcfcf7b; */
`;

const StyledSearch = styled.input`
  outline: none;
  border: 1px solid #cfcfcf7b;
  border-right: 0px;
  width: 100%;
  font-size: 14.9px;
  padding-left: 15px;
  color: #434343;
  background: #f4f4f446;

  &::placeholder {
    color: #4a4a4a;
    opacity: 0.7;
  }

  /* Styling the clear (X) button for WebKit-based browsers */
  &::-webkit-search-cancel-button {
    position: relative;
    width: 15px;
    height: 25px;
    padding-right: 5px;
    background-color: black;
    background-size: 12px 12px;

    transition: background-color 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: #a9a9a9;
    }
  }

  &::-ms-clear {
    display: none; /* Hide the default clear button */
  }
`;

const StyledSearchIcon = styled(FaSearch)`
  font-size: 17px;
  color: #999;
  transition: color 0.2s ease-in-out;
`;

const StyledSearchIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid grey;
  border-radius: 5px;
  border-bottom-right-radius: 0px;
  width: 80px;
  border-top-right-radius: 0px;
  border: 1px solid #a4a4a47c;
  background-color: #c8c8c853;
`;

const StyledDropdownWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledPaginationWrap = styled.ul`
  list-style: none;
  display: flex;
  padding: 0px;
  grid-column: 4;
`;

const StyledPaginationNav = styled.nav``;

const StyledAddButtonWrap = styled.div`
  display: flex;
  /* justify-content: flex-end; */
  width: 100%;
`;

const StyledPaginationItems = styled.li`
  padding: 10px;
  background-color: ${(props) => (props.isActive ? "#e7e7e7" : "#dfdfdf46")};
  transition: background-color 0.1s ease-in-out;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #d6d6d688;
    color: #1f1f1f;
  }
`;

//Dynamic table with a filter function
export function Table({
  headers,
  type,
  route,
  td,
  dropdown,
  searchCategory,
  searchCategoryTitles,
  table_size,
  filterInitialVal,
}) {
  const dropdowncomp = FilterDropDownComp({
    row: 1,
    col: 4,
    arr: searchCategory,
    searchtitle: searchCategoryTitles,
    placeholderprop: "Select",
  });

  const fetcheddata = Fetch({ type, route });

  const [arrow, setArrow] = useState(null);
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);

  //State and Variables used for the tables pagination
  const [currentPage, setCurrentPage] = useState(1);
  const numRowsPerPage = 100;
  const lastIndex = numRowsPerPage * currentPage;
  const firstIndex = lastIndex - numRowsPerPage;
  const fetchedRows = fetcheddata.slice(firstIndex, lastIndex);
  const numOfPages = Math.ceil(fetcheddata.length / numRowsPerPage);
  const numOfPagesPagination = [...Array(numOfPages + 1).keys()].slice(1);

  //Functions to handle page changes
  const prevPage = () => {
    if (currentPage != 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage != numOfPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const changePage = (page) => {
    setCurrentPage(page);
  };

  const arrowState = (arrow, index) => {
    return arrow == null ? (
      <FaIcons.FaAngleDown
        onClick={() => openArrow(index)}
        style={{
          color: arrow === index ? "#8d8d8d" : "#000000",
        }}
      />
    ) : (
      <FaIcons.FaAngleUp
        onClick={() => openArrow(index)}
        style={{
          color: arrow === index ? "#8d8d8d" : "#000000",
        }}
      />
    );
  };

  const openArrow = (index) => {
    if (arrow === index) {
      setArrow(null);
    } else {
      setArrow(index);
    }
  };

  return (
    <>
      <StyledFilterContainer>
        <StyledSearchIconWrap>
          <StyledSearchIcon />
        </StyledSearchIconWrap>
        <StyledSearchBox>
          <StyledSearch
            type="search"
            placeholder="Filter"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          ></StyledSearch>
        </StyledSearchBox>
        <StyledDropdownWrap>{dropdowncomp.render}</StyledDropdownWrap>
        <StyledAddButtonWrap>
          <AddToStock
            portalFunc={() => {
              setAddModal(!addModal);
            }}
          ></AddToStock>
        </StyledAddButtonWrap>
      </StyledFilterContainer>
      <StyledTableContainer style={{ height: table_size }}>
        <StyledTable>
          <Styledtbody>
            <StyledTableRows>
              {headers.map((data) => (
                <StyledTableHeading key={data}>{data}</StyledTableHeading>
              ))}
              <StyledTableHeading></StyledTableHeading>
            </StyledTableRows>
            {fetchedRows
              .filter((data) => {
                if (dropdowncomp.selectedValue == null) {
                  return data[filterInitialVal]
                    .toLowerCase()
                    .includes(search.toLowerCase());
                } else {
                  return search.toLowerCase() === ""
                    ? data
                    : data[dropdowncomp.selectedValue]
                        .toLowerCase()
                        .includes(search.toLowerCase());
                }
              })
              .map((data, index) => (
                <React.Fragment key={data.id}>
                  <StyledTableRows>
                    {td.map((tabledata) => (
                      <StyledTableData key={tabledata}>
                        {data[tabledata]}
                      </StyledTableData>
                    ))}

                    {dropdown ? (
                      <>
                        <StyledTableData>
                          <StyledArrowDown>
                            {arrowState(arrow, index)}
                          </StyledArrowDown>
                        </StyledTableData>
                      </>
                    ) : (
                      <>
                        <StyledTableData>
                          <FaIcons.FaAngleUp
                            onClick={() => openArrow(index)}
                            style={{
                              color: arrow === index ? "#8d8d8d" : "#000000",
                            }}
                          />
                        </StyledTableData>
                      </>
                    )}
                  </StyledTableRows>

                  {dropdown && arrow === index ? (
                    <Medlistdata
                      dropdown={arrow === index}
                      Product_ID={data.product_id}
                      Product_name={data.product_name}
                      Product_type={data.product_type}
                      DateExpiry={data.Date_Of_Expiry}
                      DateInspected={""}
                      Location={data.location_flightnum}
                      Quantity={data.Quantity}
                      UserId={data.user_id}
                      UserName="Reda Ouhda"
                    />
                  ) : null}
                </React.Fragment>
              ))}
          </Styledtbody>
        </StyledTable>
      </StyledTableContainer>
      <StyledPaginationNav>
        <StyledPaginationWrap>
          <StyledPaginationItems className="page-item" onClick={prevPage}>
            Prev{" "}
          </StyledPaginationItems>
          {numOfPagesPagination.map((numbers, i) => (
            <StyledPaginationItems
              key={i}
              onClick={() => changePage(numbers)}
              isActive={currentPage === numbers}
            >
              {numbers}
            </StyledPaginationItems>
          ))}
          <StyledPaginationItems className="page-item" onClick={nextPage}>
            Next{" "}
          </StyledPaginationItems>
        </StyledPaginationWrap>
      </StyledPaginationNav>
      {/* <AddStockModal
        open={addModal}
        onClose={() => {
          setAddModal(false);
        }}
      /> */}
      <AddStockModalEXP
        open={addModal}
        onClose={() => {
          setAddModal(false);
        }}
      />
    </>
  );
}

//Dynamic table with no filter function
export function TableStatic({ arr, headers, td, dropdown, ordertable }) {
  const [arrow, setArrow] = useState(null);
  const [array, setArray] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("Orders_info");
    if (data) {
      setArray(JSON.parse(data));
    } else {
      setArray(arr);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Orders_info", JSON.stringify(array));
  }, [array]);

  useEffect(() => {
    setArray(arr);
  }, [arr]);

  const openArrow = (index) => {
    if (arrow === index) {
      setArrow(null);
    } else {
      setArrow(index);
    }
  };

  const numOfOrders = array.length;

  return {
    numOfOrders,
    render: (
      <>
        <StyledTable style={{ height: "auto" }}>
          <Styledtbody>
            <StyledTableRows>
              {headers.map((data) => (
                <StyledTableHeading key={data}>{data}</StyledTableHeading>
              ))}
            </StyledTableRows>

            {array.map((data, index) => (
              <StyledTableRows key={index}>
                {Object.values(data).map((value, i) => (
                  <StyledTableData key={i}>{value}</StyledTableData>
                ))}
                {dropdown ? (
                  <StyledTableData>
                    <StyledArrowDown>
                      <FaIcons.FaAngleDown
                        onClick={() => openArrow(index)}
                        style={{
                          color: arrow === index ? "#8d8d8d" : "#000000",
                        }}
                      />
                    </StyledArrowDown>
                  </StyledTableData>
                ) : null}
              </StyledTableRows>
            ))}

            {dropdown && arrow !== null ? (
              <Medlistdata
                dropdown={arrow !== null}
                Product_name={array[arrow]?.Product}
                Product_type={array[arrow]?.Product_type}
                DateExpiry={array[arrow]?.DateOfOrder}
                DateInspected=""
                Location={array[arrow]?.Plane}
                Quantity={array[arrow]?.Qty}
                UserId="0093"
                UserName="Reda Ouhda"
                Opentate={arrow}
              />
            ) : null}
          </Styledtbody>
        </StyledTable>
      </>
    ),
  };
}

//Homepage table
export function TableHomePage({
  headers,
  dropdown,
  dropDownArr,
  table_height,
}) {
  const ActiveOrders = useContext(ActiveOrderContext);
  const [arrow, setArrow] = useState(null);

  const openArrow = (index) => {
    setArrow((prevArrow) => (prevArrow === index ? null : index));
  };

  return (
    <StyledTableContainer style={{ height: table_height }}>
      <StyledTable>
        <Styledtbody>
          <StyledTableRows>
            {headers.map((header) => (
              <StyledTableHeading key={header}>{header}</StyledTableHeading>
            ))}
            {dropdown && <StyledTableHeading></StyledTableHeading>}
          </StyledTableRows>

          {ActiveOrders.map((data, index) => (
            <React.Fragment key={index}>
              <StyledTableRows>
                <StyledTableData>{data.Product_name}</StyledTableData>
                <StyledTableData>{data.PO}</StyledTableData>
                <StyledTableData>{data.Date}</StyledTableData>
                {dropdown && (
                  <StyledTableData>
                    <StyledArrowDown>
                      <FaIcons.FaAngleDown
                        onClick={() => openArrow(index)}
                        style={{
                          color: arrow === index ? "#8d8d8d" : "#000000",
                        }}
                      />
                    </StyledArrowDown>
                  </StyledTableData>
                )}
              </StyledTableRows>

              {dropdown && arrow === index && (
                <StyledTableRows>
                  <StyledTableData colSpan={headers.length + 1}>
                    <ActiveOrderData arr={dropDownArr[arrow]} />
                  </StyledTableData>
                </StyledTableRows>
              )}
            </React.Fragment>
          ))}
        </Styledtbody>
      </StyledTable>
    </StyledTableContainer>
  );
}

const StyledRowNotification = styled.tr`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  background-color: ${(props) => {
    if (props.expiryDate && props.expiryDate.includes("Expired")) {
      return "#faadad80"; // Light red for "Expired"
    } else if (props.expiryDate && props.expiryDate.includes("Out Of Stock")) {
      return "#ffeb9c80"; // Light yellow for "outofStock"
    } else {
      return "#f3f3f350"; // Default background color
    }
  }};

  background-color: ${(props) => {
    if (props.status == "active") {
      return "#bfebb880";
    } else if (props.status == "Delivered") {
      return "#ff9c9c80";
    }
  }};
`;

//Table for medical stock which highlights stock that out-of-stock and expired
export function TableNotifications({ arr, table_height, td }) {
  return (
    <StyledTableContainer style={{ height: table_height }}>
      <StyledTable>
        <Styledtbody>
          {arr.map((data, index) => (
            <React.Fragment key={index}>
              <StyledRowNotification expiryDate={data["Date_Of_Expiry"]}>
                {td.map((item, i) => (
                  <StyledTableData key={i}>{data[item]}</StyledTableData>
                ))}
              </StyledRowNotification>
            </React.Fragment>
          ))}
        </Styledtbody>
      </StyledTable>
    </StyledTableContainer>
  );
}

const StyledRowOrderTable = styled.tr`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #cdcdcd8f;
  width: 100%;
  flex-wrap: wrap;
  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: ${(props) => {
      if (props.status == "Delivered") {
        return "#a1e99580";
      } else if (props.status == "active") {
        return "#d8d8d880";
      } else if (props.status == "Pending") {
        return "#f9df7680";
      }
    }};
  }
  background-color: ${(props) => {
    if (props.expiryDate && props.expiryDate.includes("Expired")) {
      return "#faadad80";
    } else if (props.expiryDate && props.expiryDate.includes("Out Of Stock")) {
      return "#ffeb9c80";
    } else {
      return "#f3f3f350";
    }
  }};

  background-color: ${(props) => {
    if (props.status == "Delivered") {
      return "#bfebb880";
    } else if (props.status == "active") {
      return "#eaeaea80";
    } else if (props.status == "Pending") {
      return "#ffeb9c80";
    }
  }};
`;

const StyledSubItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 17px;
`;

const SubText = styled.span`
  margin-right: 50px; /* Adjust the value as needed */
  /* font-weight: bold; */
`;

const SubTextTitle = styled.span`
  margin-right: 25px; /* Adjust the value as needed */
`;

const StyledEditIconsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  font-size: 15px;
`;

const StyledEditIcons = styled.div`
  transition: color 0.1s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #4b4b4b;
  }
`;

const StyledNoOrderMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-style: italic;

  color: #a7a7a7;
  font-size: 50px;
  /* padding-top: 90px; */
  /* padding-left: 300px; */
`;

//Table that maps through the orders and allows editing and deleting of order items.
export function OrderTable({ route, table_height, subMenuRoute, deleteRoute }) {
  const [data, setData] = useState([]);
  // State variable to store the index of the open row
  const [openRow, setOpenRow] = useState(-1);

  const [subMenu, setSubMenu] = useState(false);

  const [indexState, setIndexState] = useState(null);

  //These are the orderDetail for the dropdown of each row (Order)
  const [Orderdetails, setOrderDetails] = useState([]);

  //Sets the status of the UpdateModal
  const [modalStatus, setModalStatus] = useState({});

  //Retrieves one order id choosen by the user from an order.
  const [orderId, setOrderId] = useState(0);

  const handelEdit = (item) => {
    // console.log(item);
    setOrderId(item.order_id);
    setModalStatus((prevStatus) => ({
      ...prevStatus,
      [item.order_id]: !prevStatus[item.order_id],
    }));
  };

  const handleDelete = (item) => {
    axios
      .delete(`http://localhost:3331/Orders/${deleteRoute}/${item.order_id}`, {
        params: { PO: item.PO, product: item.product_name },
        withCredentials: true, 
      })
      .then((result) => {
        alert(result.data.message);
        location.reload();
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  const renderSubMenu = (type, item) => {
    if (type == "MedView") {
      return (
        <StyledRowOrderTable>
          <StyledTableData key={item.Order_id}>
            <SubTextTitle>{item.product_name} </SubTextTitle>
            <StyledSubItem>
              {" "}
              <SubText> Qty: {item.quantity} </SubText>{" "}
              {/* <SubText>Type: {item.product_type}</SubText> */}
            </StyledSubItem>
          </StyledTableData>
          <StyledTableData
            key={item.id}
            style={{ cursor: "pointer" }}
          ></StyledTableData>
          <StyledEditIconsWrap>
            <StyledEditIcons>
              <FaIcons.FaEdit
                style={{ paddingRight: "20px", cursor: "pointer" }}
                onClick={() => handelEdit(item)}
                key={item.id}
              />
            </StyledEditIcons>
            <StyledEditIcons>
              <FaIcons.FaTrash onClick={() => handleDelete(item)} />
            </StyledEditIcons>
          </StyledEditIconsWrap>
          <EditOrderModal
            open={modalStatus[item.order_id]}
            onClose={() => {
              setModalStatus(false);
            }}
            orderId={orderId}
            data={item}
            route="EditMedOrder"
          />
        </StyledRowOrderTable>
      );
    } else if (type == "MaintenanceView") {
      return (
        <StyledRowOrderTable>
          <StyledTableData key={item.id}>
            <SubTextTitle>
              {item.product_name} ({item.pn})
            </SubTextTitle>
            <StyledSubItem>
              <SubText> Qty: {item.quantity}</SubText>{" "}
              <SubText>Type: {item.product_type}</SubText>
              <SubText>Plane: {item.call_sign}</SubText>
              <SubText>
                Item Total Price:{" "}
                {parseInt(item.quantity) * parseInt(item.price)}
              </SubText>
            </StyledSubItem>
          </StyledTableData>
          <StyledTableData
            key={item.id}
            style={{ cursor: "pointer" }}
          ></StyledTableData>
          <StyledEditIconsWrap>
            <StyledEditIcons>
              <FaIcons.FaEdit
                style={{ paddingRight: "20px", cursor: "pointer" }}
                onClick={() => handelEdit(item)}
                key={item.id}
              />
            </StyledEditIcons>
            <StyledEditIcons>
              <FaIcons.FaTrash onClick={() => handleDelete(item)} />
            </StyledEditIcons>
          </StyledEditIconsWrap>
          {/* item.order_id allows you to return the item in the order based on its ID rather than name to avoid duplication */}
          <EditOrderModal
            open={modalStatus[item.order_id]}
            onClose={() => {
              setModalStatus(false);
            }}
            data={item}
            orderId={orderId}
            route="EditPartOrder"
          />
        </StyledRowOrderTable>
      );
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3331/${route}`, { withCredentials: true })
      .then((payload) => {
        setData(payload.data);
      })
      .catch((e) => {
        // console.log(e);
      });
  }, [route]); 

  const handleDropdownClick = (index) => {
    //When the openRow eqauls the index then the submenu is opened else its closed.
    if (openRow === index) {
      setSubMenu(true);
      setOpenRow(-1);
    } else {
      setOpenRow(index);
      setSubMenu(false);
    }
  };

  const handleOpen = (index) => {
    handleDropdownClick(index);
    setIndexState(index);
  };

  useEffect(() => {
    if (indexState != null) {
      axios
        .get(
          `http://localhost:3331/Orders/${subMenuRoute}/${data[indexState].PO}`,
          { withCredentials: true }
        )
        .then((result) => {
          setOrderDetails(result.data);
        })
        .catch((e) => {
          // console.log(e);
        });
    }
  }, [indexState]);

  return {
    Orderdetails,
    render: (
      <StyledTableContainer style={{ height: table_height }}>
        <StyledTable>
          <Styledtbody>
            {data.length == 0 ? (
              <StyledNoOrderMessage>No Active Orders</StyledNoOrderMessage>
            ) : (
              data.map((item, index) => (
                <React.Fragment key={index}>
                  <StyledRowOrderTable status={item["active"]}>
                    {Object.values(item).map((value, i) => (
                      <StyledTableData key={i}>{value} </StyledTableData>
                    ))}
                    <StyledTableData>
                      <StyledArrowDown onClick={() => handleOpen(index)}>
                        {openRow === index ? (
                          <FaIcons.FaAngleUp />
                        ) : (
                          <FaIcons.FaAngleDown />
                        )}
                      </StyledArrowDown>
                    </StyledTableData>
                  </StyledRowOrderTable>
                  {openRow === index && (
                    <StyledRowOrderTable>
                      {Orderdetails.map((item) =>
                        renderSubMenu(subMenuRoute, item)
                      )}
                    </StyledRowOrderTable>
                  )}
                </React.Fragment>
              ))
            )}
          </Styledtbody>
        </StyledTable>
      </StyledTableContainer>
    ),
  };
}
