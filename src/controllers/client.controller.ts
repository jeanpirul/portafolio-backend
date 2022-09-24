import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { Client } from "../entities_DB/client";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";

export const createClient = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    const data = await Client.query(`SELECT * FROM client WHERE email= $1;`, [
      email,
    ]);
    const client = new Client();
    if (data.length != 0) {
      return res.status(400).json({
        error: "Email ya existe, no necesita registrarlo de nuevo.",
      });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err)
        res.status(500).json({
          error: "Server error",
        });

      client.firstName = firstName;
      client.lastName = lastName;
      client.email = email;
      client.phoneNumber = phoneNumber;
      client.password = password;
      let flag = 1; //Declaring a flag

      //Inserting data into the database
      await client.save();

      (err: any) => {
        if (err) {
          flag = 0; //If client is not inserted is not inserted to database assigning flag as 0/false.
          console.error(err);
          return res.status(500).json({
            error: "Database error",
          });
        } else {
          flag = 1;
          res
            .status(200)
            .send({ message: "User added to database, not verified" });
        }
      };
      if (flag) {
        const token = jwt.sign(
          //Signing a jwt token
          {
            email: client.email,
          },
          SECRET_KEY
        );
        res.status(201).json({
          message: "Usuario registrado exitosamente!",
          token: token,
        });
      }
    });
  } catch (error) {
    //check if error is a instance of Error
    console.log("Error de creación", error);
    //send a json response with the error message
    res.status(500).json({
      error: "Database error while registring client!", //Database connection error
    });
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.find();
    !client
      ? res.status(404).json({ message: "No users found" })
      : res.json({ listClient: client });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error

    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await Client.findOneBy({
      id: id,
    });

    !client
      ? res.status(404).json({ message: "No client found" })
      : res.json({ listClient: client });
  } catch (error) {
    console.log(error);
    //check if error is instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, phoneNumber, password } = req.body;
    if (!id) return res.status(400).json({ message: "Client not found" });

    const clienteExist: any = await Client.findOneBy({
      id: id,
    });

    if (clienteExist) {
      const result = await Client.update(clienteExist, {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
      });
      return result
        ? res.status(200).json(await success({ data: result }, res.statusCode))
        : res.status(422).json(await error(res.statusCode));
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = req.params;
    if (!id) return res.status(404).json(await error(res.statusCode));

    const result: any = await Client.delete(id);
    return result
      ? res.status(200).json(await success({ data: result }, res.statusCode))
      : res.status(422).json(await error(res.statusCode));
  } catch (err) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};
