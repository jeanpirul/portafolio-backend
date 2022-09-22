import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { Client } from "../entities_DB/client";

export const createClient = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const data = await Client.query(`SELECT * FROM client WHERE email= $1;`, [
      email,
    ]);
    console.log("data ", data);
    console.log("data.rows ", data.rows.length);
    console.log("data.lenght ", data.lenght);
    if (data.length == undefined) {
      console.log("la wea es undefined");
    }
    const arr = data[0].email;

    console.log("arr ", arr);
    console.log("data[0] ", data[0]);
    console.log("data[0].email ", data[0].email);

    if (arr.length != undefined) {
      return res.status(400).json({
        error: "Email already there, No need to register again.",
      });
    }
    const client = new Client();
    client.firstName = firstName;
    client.lastName = lastName;
    client.email = email;
    client.phoneNumber = phoneNumber;
    client.password = password;

    await client.save();
    return res.json({ message: "Client created successfully! ", client });
  } catch (error) {
    console.log(error);
    //check if error is a instance of Error
    if (error instanceof Error) {
      //send a json response with the error message
      return res.status(500).json({ message: error.message });
    }
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
