import express, { query, response } from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import { serialize } from "v8";

const router = express();

router.use(bodyParser.urlencoded({ extended: true }));

//this configures our environment file .env
router.use(cookieParser());
dotenv.config();
router.use(bodyParser.json());

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
  dbpass: dbpass,
});

router.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST"],
    credentials: true,
  })
);

export async function getUser(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * users where id = ?",
      id,
      (err, res) => {
        if (err) {
          return err;
        } else {
          return res;
        }
      }
    );
    return rows;
  } catch (e) {
    throw e;
  }
}

router.route("/MedicalCrew").get((req, res) => {
  const query = "SELECT email, id FROM users ";
  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

//This function generates an access token based on the user payload that will be serialized in the token.
//exp: 5mins
function genAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
}

//This function is used to generate a access token and returns it.
//exp: 1d
function genRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h" });
}

//This function is used as MIDDLEWARE to authenticate the users token.
//Use this route for all HTTP requests.
export function authToken(req, res, next) {
  //the token taken from the header will be brought up from the validateRefreshToken() function
  //which will create a new access token.
  const token = req.cookies("tokenId");

  //If the user does not have access.
  if (token == null) {
    //401 being unauthorized
    res
      .sendStatus(401)
      .send({ message: "You do not have access to this route" });
  }

  //Now that the token is confirmed to have some value, you compare it against our own secret token
  //If the tokens match, we can return the user, which is our result case called (user)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      //This error code sees that you have a token, but the token is invalid and now the permission access is changed to
      //Forbidden
      return res.sendStatus(403);
    } else {
      req.user = user;
      //This next() function moves on from the middleware and procceeds to the HTTP request were we implemented that middleware
      next();
    }
  });
}

//Sets out refresh token in the database, for logging user activity
function setRefreshToken(token, user, tokenID) {
  return new Promise((resolve, reject) => {
    const insertQuery =
      "INSERT INTO refresh_tokens (user_id, token, token_id) VALUES (?, ?, ?)";
    const values = [user["id"], token, tokenID];

    pool.query(insertQuery, values, (err, insertResult) => {
      if (err) {
        reject(err);
      } else {
        resolve(insertResult);
      }
    });
  });
}

function getRefreshToken(tokenId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT token FROM refresh_tokens where token_id = ? ";

    pool.query(query, tokenId, (err, result) => {
      if (err) {
        reject(false);
      } else {
        if (result.length === 0) {
          reject(false);
        } else {
          resolve(result[0].token);
        }
      }
    });
  });
}

//To register the user
router
  .route("/")
  .post(async (req, res) => {
    try {
      const fname = req.body.fname;
      const lname = req.body.lname;
      const email = req.body.email;
      const password = req.body.password;
      const position = req.body.position;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const query = `INSERT INTO users (fname, lname, email, password, position)
                   VALUES ('${fname}', '${lname}', '${email}', '${hashedPassword}', '${position}')`;

      pool.query(query, (err, results) => {
        if (err) {
          res.send(err);
        } else {
          res.send(results);
        }
      });
    } catch (error) {
      res.send(error);
    }
  })
  .get((req, res) => {
    const query = "SELECT * FROM users";
    pool.query(query, (err, result) => {
      if (err) {
        res.send(err);
      } else {
      }
    });
  });

//This is where we generate the random ID for each refresh token that is distributed.
function generateRandomString(length) {
  const bytes = crypto.randomBytes(length);
  const randomString = bytes.toString("hex");
  return randomString;
}

//Route to Authenticate the user when logging in
router.route("/login").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const query = "SELECT * FROM users WHERE email = ?";

  pool.query(query, email, (err, result) => {
    
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, resultpass) => {
        if (err) {
          res.status(403);
          return;
        }
        if (resultpass) {
          const user = {
            id: result[0].id,
            fname: result[0].fname,
            lname: result[0].lname,
            email: result[0].email,
            position: result[0].position,
          };

          const tokenId = generateRandomString(16);

          const accessToken = genAccessToken(user);
          const refreshToken = genRefreshToken(user);

          //Set out access token in the http only cookie
          res.cookie("accessToken", accessToken, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
          });
          res.cookie("tokenId", tokenId, {
            httpOnly: true,
          });

          // This function sets the users refresh token accompanied with the users id into the database
          setRefreshToken(refreshToken, user, tokenId)
            .then(() => {
              res.send({
                loggedIn: true,
                user: user,
                message: "Login Successful",
              });
            })
            .catch((err) => {
              res
                .status(500)
                .send("Error occurred while setting refresh token");
            });

          return;
        } else {
          res.sendStatus(500);
          return;
        }
      });
    } else {
      res
        .send({ message: "This user does not exist", incorrect: true })
        .status(403);
    }
  });
});

router.get("/getRefreshToken", (req, res) => {
  res.send(req.cookies);
});

//We will be calling this route everytime we need to request the infomation of the user or
//To verify if the user is still logged in.
//So put this in the useEffect hook in the react authwrapper

//validates our access token
router.route("/token").get((req, res) => {
  const tokenId = req.cookies.tokenId;
  // Check if tokenId is null or undefined, which means the user does not have one set in their cookie
  if (tokenId === null || tokenId === undefined) {
    return res.send({ loggedIn: false, tokenId: tokenId });
  }

  // Get the refresh token based on its token ID
  getRefreshToken(tokenId)
    .then((token) => {
      if (token == "null" || token == undefined) {
        return res
          .cookie("accessToken", "", {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            expires: new Date(0),
          })
          .cookie("tokenId", "", {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            expires: new Date(0),
          })
          .send({ loggedIn: false })
          .status(403);
      }

      // Validate the access token
      validateAccessToken(req.cookies.accessToken)
        .then((result) => {
          // If the access token is still valid, send down the user and login status
          res.cookie("accessToken", req.cookies.accessToken, {
            httpOnly: true,
            path: "/",
            domain: "localhost",
          });
          res.send({
            loggedIn: true,
            user: {
              id: result.user.id,
              fname: result.user.fname,
              lname: result.user.lname,
              email: result.user.email,
              position: result.user.position,
            },
          });
        })
        .catch((e) => {
          // If the access token is not valid, check if the refresh token is still valid
          validateRefreshToken(token)
            .then((user) => {
              // If it is, generate a new access token and set it into the http cookie
              const accessToken = genAccessToken({
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                position: user.position,
              });
              res.cookie("accessToken", accessToken, {
                httpOnly: true,
                path: "/",
                domain: "localhost",
              });
              res.send({
                loggedIn: true,
                user: {
                  id: user.id,
                  fname: user.fname,
                  lname: user.lname,
                  email: user.email,
                  position: user.position,
                },
              });
            })
            .catch((e) => {
              // It isn't valid, set the logged-in value as false
              res
                .cookie("accessToken", "", {
                  path: "/",
                  domain: "localhost",
                  httpOnly: true,
                  expires: new Date(0),
                })
                .cookie("tokenId", "", {
                  path: "/",
                  domain: "localhost",
                  httpOnly: true,
                  expires: new Date(0),
                })
                .send({ loggedIn: false })
                .status(403);
            });
        });
    })
    .catch((e) => {
      res
        .cookie("accessToken", "", {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          expires: new Date(0),
        })
        .cookie("tokenId", "", {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          expires: new Date(0),
        })
        .send({ loggedIn: false })
        .status(403);
    });
});

//This function takes in a refresh token that has been retrieved from our database
//and uses the jwt.verify() function to verify it against the env refresh token secret
function validateRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        //If the refresh token is not valid you'll automatically remove it from the database and refresh the application
        reject(err);
      } else {
        //This returns the user object if the verification is resolved
        resolve(user);
      }
    });
  });
}

function validateAccessToken(accessToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve({ user: user });
      }
    });
  });
}

//This allows us to delete the refresh token to allow us to logout
//Unsetting the refresh token and removing that users session
router.route("/logout").delete((req, res) => {
  const tokenId = req.cookies.tokenId;
  const query = "DELETE FROM refresh_tokens WHERE token_id = ?";

  pool.query(query, tokenId, (err, result) => {
    if (err) {
      return res.sendStatus(401);
    } else {
      // Remove the cookies
      res
        .cookie("accessToken", "", {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          expires: new Date(0),
        })
        .cookie("tokenId", "", {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          expires: new Date(0),
        });

      // Set the status and send the JSON response
      res.status(204).json({ loggedIn: false });
    }
  });
});

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const query = "SELECT email, phoneNumber FROM users WHERE id = ?";

  pool.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    } else {
      res.json(results);
    }
  });
});

export function userAuthMiddleWare(req, res, next) {
  // Check if tokenId is null or undefined, which means the user does not have one set in their cookie
  const tokenId = req.cookies.tokenId;

  //Figure how to retrieve the cookies from the http cookies when activating the middleware.

  if (tokenId === null || tokenId === undefined) {
    return res
      .cookie("accessToken", "", {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        expires: new Date(0),
      })
      .cookie("tokenId", "", {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        expires: new Date(0),
      })
      .status(403)
      .send({ loggedIn: false, tokenId: tokenId });
  }

  // Get the refresh token based on its token ID
  getRefreshToken(tokenId)
    .then((token) => {
      if (token === null || token === undefined) {
        return res.status(403).send({ loggedIn: false });
      }

      // Validate the access token
      validateAccessToken(req.cookies.accessToken)
        .then((result) => {
          next();
        })
        .catch((e) => {
          // If the access token is not valid, check if the refresh token is still valid
          validateRefreshToken(token)
            .then((user) => {
              next();
            })
            .catch((e) => {
              res
                .cookie("accessToken", "", {
                  path: "/",
                  domain: "localhost",
                  httpOnly: true,
                  expires: new Date(0),
                })
                .cookie("tokenId", "", {
                  path: "/",
                  domain: "localhost",
                  httpOnly: true,
                  expires: new Date(0),
                })
                .status(403)
                .send({ loggedIn: false });
            });
        });
    })
    .catch((e) => {
      res
        .cookie("accessToken", "", {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          expires: new Date(0),
        })
        .cookie("tokenId", "", {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          expires: new Date(0),
        })
        .status(403)
        .send({ loggedIn: false });
    });
}

export default router;
