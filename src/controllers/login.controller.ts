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
    const data = await Client.query("SELECT * FROM client WHERE email= $1;", [
      email,
    ]); //Verifying if the client exists in the database
    bcrypt.compare(password, data[0].password, (err, result) => {
      console.log("result ", result);
      //Comparing the hashed password
      if (err) {
        res.status(500).json({
          error: "Server error",
        });
      } else if (result) {
        res.status(400).json({
          error: "Enter correct password!",
        });
      }
      // else if (result) {
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
      // } else {
      //   //Declaring the errors
      //   if (!result)
      //     res.status(400).json({
      //       error: "Enter correct password!",
      //     });
      // }
    });
    // }
  } catch (err) {
    res.status(400).json({
      error: "Usuario no registrado, por favor registrarse.",
    });
    // res.status(500).json({
    //   error: "Database error occurred while signing in!", //Database connection error
    // });
  }
};
