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

    if (true) {
      if (password != data[0].password) {
        res.status(200).send({
          error: "Ingrese una contraseña existente para el usuario ingresado",
        });
        return true;
      }
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
    }

    // bcrypt.compare(password, data[0].password, (err, result) => {
    //   //Comparing the hashed password
    //   if (err) {
    //     res.status(500).json({
    //       error: "Server error",
    //     });
    //   } else if (result) {
    //     res.status(400).json({
    //       error: "Enter correct password!",
    //     });
    //   }
    //   //Checking if credentials match
    //   const token = jwt.sign(
    //     {
    //       email: email,
    //     },
    //     SECRET_KEY
    //   );
    //   res.status(200).json({
    //     message: "User signed in!",
    //     token: token,
    //   });
    // });
  } catch (err) {
    res.status(400).json({
      error: "Usuario no registrado, por favor registrarse.",
    });
  }
};
