import express, { response } from "express";
import mysql from "mysql2";
import { getUser } from "../routes/users.js";
import fs from "fs";
import axios from "axios";
import { reject } from "bcrypt/promises.js";
import { rejects } from "assert";
import { userAuthMiddleWare } from "./users.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const dbport = 3301;
const dbhost = "localhost";
const dbname = "Stock_AOM";
const dbuser = "root";
const dbpass = " ";

const pool = mysql.createPool({
  host: dbhost,
  port: dbport,
  user: dbuser,
  database: dbname,
  dbpass: dbpass,
});

export const MedOrder = express.Router();
export const DrugOrder = express.Router();
export const PartOrder = express.Router();

DrugOrder.use(cookieParser());
DrugOrder.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
DrugOrder.use(bodyParser.json());

PartOrder.use(cookieParser());
PartOrder.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
PartOrder.use(bodyParser.json());

MedOrder.use(cookieParser());
MedOrder.use(userAuthMiddleWare);
MedOrder.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
MedOrder.use(bodyParser.json());

MedOrder.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE"],
  })
);

DrugOrder.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE"],
  })
);

PartOrder.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE"],
  })
);

// PartOrder.use(userAuthMiddleWare);
DrugOrder.use(userAuthMiddleWare);
MedOrder.use(userAuthMiddleWare);

//ASYNC ISSUE WITH RETURN VALUE !!!!
function generatePO(tableName) {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  let numOfOrdersByMonth = 0;

  console.log(month);
  console.log(year);

  const query = `SELECT COUNT(*) AS numOfOrdersByMonth FROM MaintenanceOrders WHERE YEAR(DateOrdered) = ${year} AND MONTH(DateOrdered) = ${month}`;

  pool.query(query, (err, result) => {
    if (result && result.length > 0) {
      numOfOrdersByMonth = result[0].numOfOrdersByMonth;

      console.log("This is the Year: " + year.toString().slice(2));
      console.log("This is the Month: " + month.toString().padStart(2, "0"));

      const poString = `PO${year.toString().slice(2)}${month
        .toString()
        .padStart(2, "0")}${numOfOrdersByMonth.toString().padStart(2, "0")}`;

      return poString;
    } else if (err) {
      console.log(err);
    }
  });
}

PartOrder.route("/PO").post((req, res) => {
  generatePO("MaintenanceOrders").then((result) => {
    console.log(result.data);
  });
  console.log(generatePO("MaintenanceOrders"));
  res.send(generatePO("MaintenanceOrders"));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const lookUpProductId = (ProductName, TableName) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT product_id FROM ${TableName} WHERE product_name = ? LIMIT 1`;

    pool.query(query, ProductName, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

const lookUpSupplierId = (SupplierName, TableName) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT Supplier_id FROM ${TableName} WHERE Supplier = ? LIMIT 1`;

    pool.query(query, SupplierName, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

DrugOrder.route("/DrugOrder/NumOfOrders").get((req, res) => {
  const query =
    "SELECT COUNT(DISTINCT PO) as OrderCount\
    FROM DrugOrders\
    WHERE MONTH(DateOrdered) = MONTH(CURRENT_DATE) AND YEAR(DateOrdered) = YEAR(CURRENT_DATE);";
  pool.query(query, (err, response) => {
    if (err) {
      res.sendStatus(500);
    } else {
      const OrderCount = response[0].OrderCount;
      res.status(200).send(OrderCount.toString());
    }
  });
});

DrugOrder.route("/DrugOrder/AllOrders").get((req, res) => {
  const query = "Select * From DrugOrders";

  pool.query(query, (err, response) => {
    if (err) {
      res.sendStatus(404).send(err);
    } else {
      res.send(response);
    }
  });
});

DrugOrder.route("/DrugOrder").post(async (req, res) => {
  const items = [];

  try {
    for (let i = 0; i < req.body.neworder.length; i++) {
      const productId = await lookUpProductId(
        req.body.neworder[i].Product,
        "Drug_stock"
      );

      const order = {
        product_name: productId[0].product_id,
        product_type: req.body.neworder[i].ProductType,
        quantity: req.body.neworder[i].Qty,
      };

      items.push(order);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
    return;
  }

  const orderInfo = {
    PO: req.body.neworder[0].PO,
    uid: req.body.orderInfo.uid,
    DateOrdered: req.body.orderInfo.DateOrdered,
    active: req.body.orderInfo.active,
  };

  const valuesArray = items.map((order) => [
    orderInfo.PO,
    order.quantity,
    orderInfo.uid,
    order.product_name,
    orderInfo.DateOrdered,
    orderInfo.active,
  ]);

  const query = `INSERT INTO DrugOrders (PO, quantity, uid, product_id, DateOrdered, active) VALUES ?`;

  pool.query(query, [valuesArray], (err, response) => {
    if (err) {
      res.send({ error: "Internal Server Error" });
      console.log(err);
      return;
    } else {
      res.send({ message: "Order Placed" });
    }
  });
});

DrugOrder.route("/Active").get((req, res) => {
  const joinQuery =
    "Select PO ,product_name, DateOrdered FROM Drug_stock INNER JOIN DrugOrders ON Drug_stock.product_id = DrugOrders.product_id ";
  const query = "SELECT * from DrugOrders WHERE active = 'active'";
  pool.query(joinQuery, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

DrugOrder.route("/ActiveCount").get((req, res) => {
  const query =
    "SELECT COUNT(DISTINCT PO) FROM DrugOrders WHERE active = 'active'";

  pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ message: "Error " + err });
    } else {
      res.send({
        message: "Success",
        payload: result[0]["COUNT(DISTINCT PO)"],
      });
    }
  });
});

DrugOrder.route("/ActiveCount/:PO").get((req, res) => {
  const query = "SELECT COUNT(*) FROM DrugOrders WHERE PO = ? ";

  pool.query(query, req.params.PO, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ message: "Error " + err });
    } else {
      res.send({ message: "Success", payload: result[0]["COUNT(*)"] });
    }
  });
});

DrugOrder.route("/View").get((req, res) => {
  const query =
    "SELECT product_name, product_type, PO, quantity, Order_id FROM DrugOrders";

  pool.query(query, (err, result) => {
    if (err) {
      res.send({ message: "no good " + err });
      console.log(err);
      return;
    } else {
      res.send({ payload: result });
    }
  });
});

DrugOrder.route("/PastMedOrders").get((req, res) => {
  const query =
    "SELECT product_name, DATE_FORMAT(StatusChangeDate, '%Y/%m/%d') AS FormattedDate ,product_type, PO, DrugOrders.quantity, active,Order_id\
  FROM DrugOrders INNER JOIN Drug_stock ON DrugOrders.product_id = Drug_stock.product_id \
  WHERE active = 'pending' OR active = 'delivered';";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

DrugOrder.route("/MedView").get((req, res) => {
  const query =
    "SELECT DISTINCT PO, CONCAT(DATE_FORMAT(DateOrdered, '%Y-%m-%d')) AS FormattedDate, active\
    FROM Drug_stock\
    INNER JOIN DrugOrders ON Drug_stock.product_id = DrugOrders.product_id WHERE active = 'active'\
    GROUP BY PO DESC;\
    ";

  pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving data" });
    } else {
      res.send(result);
    }
  });
});

DrugOrder.route("/MedView/:PO").get((req, res) => {
  const PO = req.params.PO;

  const query =
    "SELECT PO ,product_name, order_id,DrugOrders.quantity, Date_Of_Expiry, CONCAT(DATE_FORMAT(DateOrdered, '%Y-%m-%d')) AS FormattedDate, product_type, fname, lname, StatusChangeDate,  active FROM Drug_stock " +
    "INNER JOIN DrugOrders ON Drug_stock.product_id = DrugOrders.product_id \
     INNER JOIN users ON DrugOrders.uid = users.id \
     WHERE DrugOrders.PO = ? ";

  pool.query(query, [PO], (error, results) => {
    if (error) {
      console.log("Error executing the query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

DrugOrder.route("/ExportMedPO/:PO").get((req, res) => {
  const query =
    "SELECT PO, product_name, product_type, DrugOrders.quantity, DateOrdered FROM DrugOrders \
  INNER JOIN Drug_stock ON Drug_stock.product_id  = DrugOrders.product_id\
  WHERE PO = ? ";

  pool.query(query, req.params.PO, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error " + err });
    } else {
      res.status(200).send({ message: "Success", payload: result });
    }
  });
});

DrugOrder.route("/EditMedOrder/:ID").put((req, res) => {
  const query = `UPDATE DrugOrders SET ${req.body.type} = ${req.body.value} WHERE order_id = ?`;

  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send({ message: "Update Successful" });
    }
  });
});

DrugOrder.route("/DeleteMedItem/:ID").delete((req, res) => {
  const query = "DELETE FROM DrugOrders WHERE order_id = ? ";

  pool.query(query, [req.params.ID], (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error Deleting Item" });
    } else {
      res.status(200).send({
        message: req.query.product + " Has Been Deleted From " + req.query.PO,
      });
    }
  });
});

DrugOrder.route("/ChangeMedStatus/:PO/:Status").put((req, res) => {
  const query =
    "UPDATE DrugOrders SET active = ?, StatusChangeDate = CURRENT_DATE() WHERE PO = ?";

  pool.query(query, [req.params.Status, req.params.PO], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error Updating" });
    } else {
      res
        .status(200)
        .send({ message: `Order ${req.params.PO} has been updated` });
    }
  });
});

DrugOrder.route("/Export/:PO").get((req, res) => {
  const PO = req.params.PO;

  const query =
    "SELECT product_name, DrugOrders.quantity, Date_Of_Expiry, Order_id, DateOrdered, product_type FROM Drug_stock " +
    "INNER JOIN DrugOrders ON Drug_stock.product_id = DrugOrders.product_id WHERE DrugOrders.PO = ?";

  pool.query(query, [PO], (error, results) => {
    if (error) {
      console.log("Error executing the query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json(results);
  });
});

DrugOrder.route("/OrderChart").get((req, res) => {
  const query =
    "SELECT DISTINCT YEAR(DateOrdered) AS OrderYear, MONTH(DateOrdered) AS OrderMonth, \
    CAST(SUM(CASE WHEN OrderType = 'MedOrder' THEN 1 ELSE 0 END) AS INT) AS DrugOrders, \
    CAST(SUM(CASE WHEN OrderType = 'PartOrder' THEN 1 ELSE 0 END) AS INT) AS MaintenanceOrders \
  FROM (\
    SELECT  DISTINCT DateOrdered, PO, 'MedOrder' AS OrderType FROM DrugOrders \
    WHERE YEAR(DateOrdered) = YEAR(CURRENT_TIMESTAMP) \
    UNION ALL \
    SELECT  DISTINCT DateOrdered, PO, 'PartOrder' AS OrderType FROM MaintenanceOrders \
    WHERE YEAR(DateOrdered) = YEAR(CURRENT_TIMESTAMP) \
  ) AS CombinedOrders \
  GROUP BY YEAR(DateOrdered), MONTH(DateOrdered);\
  ";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

PartOrder.route("/Parts/numOfOrders").get(async (req, res) => {
  const query =
    "SELECT COUNT(DISTINCT PO) AS orderCount \
    FROM MaintenanceOrders \
    WHERE MONTH(DateOrdered) = MONTH(CURRENT_DATE) AND YEAR(DateOrdered) = YEAR(CURRENT_DATE);";

  pool.query(query, (err, response) => {
    if (err) {
      res.sendStatus(500);
    } else {
      // Access the 'orderCount' alias in the response object
      const orderCount = response[0].orderCount;
      res.status(200).send(orderCount.toString());
    }
  });
});

//Route to insert an order into the db.
PartOrder.route("/PartOrder").post(async (req, res) => {
  try {
    const valuesArray = [];

    for (let i = 0; i < req.body.data.length; i++) {
      const product = req.body.data[i].Product;
      const supplier = req.body.data[i].Supplier;

      // Perform a lookup for product_id and Supplier_id based on the product names and search by table name
      const [productRow, supplierRow] = await Promise.all([
        lookUpProductId(product, "Maintenance_stock"),
        lookUpSupplierId(supplier, "Suppliers"),
      ]);

      const values = [
        req.body.data[i].OrderCode,
        req.body.data[i].Qty,
        req.body.data[i].uid,
        productRow[0].product_id,
        supplierRow[0].Supplier_id,
        req.body.data[i].pn,
        req.body.data[i].call_sign,
        req.body.data[i].price,
        req.body.data[i].DateOfOrder,
        req.body.data[i].active,
      ];
      valuesArray.push(values);
    }

    const query =
      "INSERT INTO MaintenanceOrders (PO, quantity, uid, product_id, Supplier_id, pn, call_sign, price, DateOrdered, active) VALUES ?";

    pool.query(query, [valuesArray], (err, response) => {
      if (err) {
        res.send({ message: "no good " });
        console.log(err);
        return;
      } else {
        res.send({ message: "Order created successfully" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error inserting orders: " + error.message });
  }
});

PartOrder.route("/MaintenanceView").get((req, res) => {
  const query =
    "SELECT  DISTINCT PO, Supplier, active,CONCAT(DATE_FORMAT(DateOrdered, '%Y-%m-%d')) AS FormattedDate FROM Maintenance_stock\
     INNER JOIN MaintenanceOrders ON Maintenance_stock.product_id = MaintenanceOrders.product_id \
     INNER JOIN Suppliers ON MaintenanceOrders.Supplier_id = Suppliers.Supplier_id WHERE active = 'active' GROUP BY PO DESC";

  pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

PartOrder.route("/MaintenanceView/:PO").get((req, res) => {
  const query =
    "SELECT PO, product_name, order_id,MaintenanceOrders.price, MaintenanceOrders.call_sign, pn,product_type,MaintenanceOrders.quantity, Supplier, CONCAT(DATE_FORMAT(DateOrdered, '%Y-%m-%d')) AS FormattedDate, active FROM Maintenance_stock\
    INNER JOIN MaintenanceOrders ON Maintenance_stock.product_id = MaintenanceOrders.product_id \
    INNER JOIN Suppliers ON MaintenanceOrders.Supplier_id = Suppliers.Supplier_id\
    WHERE PO = ? ";

  pool.query(query, req.params.PO, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching data");
    } else {
      res.send(result);
    }
  });
});

PartOrder.route("/ExportPartPO/:PO").get((req, res) => {
  const query =
    "SELECT product_name, pn, PO,MaintenanceOrders.price, MaintenanceOrders.quantity, \
    Supplier, Suppliers.email AS supplier_Email, Suppliers.phoneNumber as supplier_phoneNumber, Suppliers.Country ,CONCAT(DATE_FORMAT(DateOrdered, '%Y-%m-%d')) AS FormattedDate\
    ,Suppliers.address ,users.email, users.phoneNumber \
    FROM MaintenanceOrders\
    INNER JOIN Suppliers ON Suppliers.Supplier_id = MaintenanceOrders.Supplier_id\
    INNER JOIN Maintenance_stock ON Maintenance_stock.product_id = MaintenanceOrders.product_id\
    INNER JOIN users ON users.id = MaintenanceOrders.uid WHERE PO = ? \
  ";

  pool.query(query, req.params.PO, (error, results) => {
    if (error) {
      console.log("Error executing the query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

PartOrder.route("/ChangePartStatus/:PO/:Status").put((req, res) => {
  const query =
    "UPDATE MaintenanceOrders SET active = ?, StatusChangeDate = CURRENT_DATE WHERE PO = ?";

  pool.query(query, [req.params.Status, req.params.PO], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error Updating" });
    } else {
      res
        .status(200)
        .send({ message: `Order ${req.params.PO} has been updated` });
    }
  });
});

PartOrder.route("/EditPartOrder/:ID").put((req, res) => {
  const query = `UPDATE MaintenanceOrders SET ${req.body.type} = ${req.body.value} WHERE order_id = ?`;

  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send({ message: "Update Successful" });
    }
  });
});

PartOrder.route("/DeletePartItem/:ID").delete((req, res) => {
  const query = "DELETE FROM MaintenanceOrders WHERE order_id = ? ";

  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error Deleting Item" });
    } else {
      res.status(200).send({
        message: req.query.product + " Has Been Deleted From " + req.query.PO,
      });
    }
  });
});

PartOrder.route("/PartOrderLineGraph").get((req, res) => {
  const query =
    "SELECT COUNT(PO) AS numberOfOrders, DAY(DateOrdered) AS day FROM MaintenanceOrders WHERE MONTH(DateOrdered) = MONTH(NOW()) GROUP BY DAY(DateOrdered)";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

PartOrder.route("/PastPartOrders").get((req, res) => {
  const query =
    "SELECT product_name, DATE_FORMAT(StatusChangeDate, '%Y/%m/%d') AS FormattedDate ,product_type, PO, MaintenanceOrders.quantity, active,Supplier_id,Order_id\
  FROM MaintenanceOrders INNER JOIN Maintenance_stock ON MaintenanceOrders.product_id = Maintenance_stock.product_id \
  WHERE active = 'pending' OR active = 'delivered'; ";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

PartOrder.route("/SupplierOrderMatch/:PO").get((req, res) => {
  const query =
    "SELECT Supplier_id AS ID FROM MaintenanceOrders WHERE PO = ? LIMIT 1";

  pool.query(query, req.params.PO, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});
