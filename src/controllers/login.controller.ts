import { Request, Response } from "express";
import { Client } from "../entities_DB/client";
import("../config/config");
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";

//Login Function
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const data = await Client.query(`SELECT * FROM client WHERE email= $1;`, [
      email,
    ]); //Verifying if the client exists in the database

    console.log("data ", data);
    console.log("data.length ", data.length);

    // console.log("data ", data);
    // console.log("data.email ", data.email);
    // console.log("data[email] ", data[email]);
    // console.log("data[0] ", data[0]);
    // console.log("data[3] ", data[3]);
    const client = data.rows;
    if (client.length === 0) {
      res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    } else {
      bcrypt.compare(password, client[0].password, (err, result) => {
        //Comparing the hashed password
        if (err) {
          res.status(500).json({
            error: "Server error",
          });
        } else if (result === true) {
          //Checking if credentials match
          const token = jwt.sign(
            {
              email: email,
            },
            SECRET_KEY
          );
          res.status(200).json({
            message: "User signed in!",
            token: token,
          });
        } else {
          //Declaring the errors
          if (!result)
            res.status(400).json({
              error: "Enter correct password!",
            });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error occurred while signing in!", //Database connection error
    });
  }
};
