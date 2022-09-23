import { Request, Response } from "express";
import { Client } from "../entities_DB/client";
import("../config/config");
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    const data = await Client.query(`SELECT * FROM client WHERE email= $1;`, [
      email,
    ]);
    console.log("data ", data); //Checking if client already exists
    console.log("data.length ", data.length); //Checking if client already exists
    console.log("data[0] ", data[0]); //Checking if client already exists
    console.log("data[0].email ", data[0].email); //Checking if client already exists

    // const arr = data.rows;
    const arr = data[0].email;
    console.log("arr ", arr);
    if (data.length != 0) {
      return res.status(400).json({
        error: "Email already there, No need to register again.",
      });
    }
    console.log("no existe registro");
    // bcrypt.hash(password, 10, (err, hash) => {
    //   if (err)
    //     res.status(500).json({
    //       error: "Server error",
    //     });
    //   const client = {
    //     firstName,
    //     lastName,
    //     email,
    //     phoneNumber,
    //     password: hash,
    //   };
    //   let flag = 1; //Declaring a flag

    //   //Inserting data into the database
    //   Client.query(
    //     `INSERT INTO client (firstName, lastName, email, phoneNumber, password) VALUES ($1,$2,$3,$4,$5);`,
    //     [
    //       client.firstName,
    //       client.lastName,
    //       client.email,
    //       client.phoneNumber,
    //       client.password,
    //     ]
    //   ),
    //     (err: any) => {
    //       if (err) {
    //         flag = 0; //If client is not inserted is not inserted to database assigning flag as 0/false.
    //         console.error(err);
    //         return res.status(500).json({
    //           error: "Database error",
    //         });
    //       } else {
    //         flag = 1;
    //         res
    //           .status(200)
    //           .send({ message: "User added to database, not verified" });
    //       }
    //     };
    //   if (flag) {
    //     const token = jwt.sign(
    //       //Signing a jwt token
    //       {
    //         email: client.email,
    //       },
    //       SECRET_KEY
    //     );
    //   }
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error while registring client!", //Database connection error
    });
  }
};
