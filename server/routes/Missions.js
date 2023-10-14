import express, { query, response } from "express";
import mysql from "mysql2";
import { userAuthMiddleWare } from "./users.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const dbport = 3301;
const dbhost = "localhost";
const dbname = "Stock_AOM";
const dbuser = "root";
const dbpass = "";

const pool = mysql.createPool({
  host: dbhost,
  port: dbport,
  user: dbuser,
  database: dbname,
  password: dbpass,
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAKE AN ALGO THAT RECOMENDS MATERIAL BASED ON THE FLIGHT LENGTH, PATIENT CONDITION, AND DIFFERENT FACTORS IN A FUTURE UPDATE //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MissionRouter = express();
MissionRouter.use(cookieParser());
MissionRouter.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
MissionRouter.use(bodyParser.json());

MissionRouter.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


//Figure out why this is happening for the update route, CORS config maybe ? put request maybe 
//Changing it doesnt do anything so maybe an issue on the client side ? 

MissionRouter.use(userAuthMiddleWare);

MissionRouter.route("/updateMissionStatus/:ID").put((req, res) => {
  const query = "UPDATE missions SET active = '0' WHERE missions.id = ?";
  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("Mission Status Updated Successfully");
    }
  });
});



MissionRouter.route("/FlightsPerPlane").get((req, res) => {
  const query = "SELECT mission_data FROM missions";
  let planesData = [];

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else {
      result.forEach((row) => {
        const parsedData = JSON.parse(row.mission_data);
        const plane = parsedData.flightInfo.plane;

        const planeIndex = planesData.findIndex((item) => item.name === plane);

        if (planeIndex !== -1) {
          planesData[planeIndex].NumberOfFlights++;
        } else {
          planesData.push({ name: plane, NumberOfFlights: 1 });
        }
      });

      res.json(planesData);
    }
  });
});

MissionRouter.route("/").get((req, res) => {
  const query = "SELECT mission_data FROM missions WHERE active = 0";
  let parsedArray = [];

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      result.map((value, index) => {
        const parsedData = JSON.parse(result[index].mission_data);
        parsedArray.push(parsedData);
      });

      res.send(parsedArray);
    }
  });
});

MissionRouter.route("/PieChart").get((req, res) => {
  //Only do the ones for each year OR each month.
  const query =
    "SELECT DISTINCT COUNT(*) AS Missions FROM Missions WHERE YEAR(MissionDate) = YEAR(CURDATE())";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.send(result).status(200);
    }
  });
});

MissionRouter.route("/Active").get((req, res) => {
  const query = "SELECT id, mission_data FROM missions WHERE active = 1";
  let parsedArray = [];

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      // Use forEach to iterate through the result
      result.forEach((row) => {
        const parsedData = JSON.parse(row.mission_data);
        parsedArray.push({ id: row.id, parsedData, active: row.active });
      });

      res.send(parsedArray);
    }
  });
});

MissionRouter.route("/NewMission").post((req, res) => {
  const query = `INSERT INTO missions(mission_data) VALUES (?)`;

  pool.query(query, req.body.data, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).send({ message: "Insert Success" });
    }
  });
});

function countDrugs(drugs) {
  //linear search can use a hashmap to get O(log(n))

  for (let i = 0; i < drugs.length; i++) {
    for (let j = 0; j < i; i++) {}
  }
}

//Remove the out of stock ting in the home box for a circle graph of the entries and removals this month.
// Or approaching expiry date.
