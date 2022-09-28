import { Request, Response } from "express";
import { error, success } from "../config/responseApi";
import { Client } from "../entities_DB/client";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../environment";
import { insertBitacora } from "./action.controller";
import { Action } from "../entities_DB/action";
import { SaveOptions, RemoveOptions } from "typeorm";

export const createClient = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    const data = await Client.query(`SELECT * FROM client WHERE email= $1;`, [
      email,
    ]);
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
      let flag = 1; //Declaring a flag

      //Inserting data into the database
      const result = await Client.save({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
      });

      await insertBitacora({
        nameTableAction: "client",
        idTableAction: result.id,
        idClient: result.id,
        emailIdentifier: result.email,
        actionDetail: `Creación de nuevo cliente con email: "${result.email}"`,
        hasId: function (): boolean {
          throw new Error("Function not implemented.");
        },
        save: function (options?: SaveOptions | undefined): Promise<Action> {
          throw new Error("Function not implemented.");
        },
        remove: function (
          options?: RemoveOptions | undefined
        ): Promise<Action> {
          throw new Error("Function not implemented.");
        },
        softRemove: function (
          options?: SaveOptions | undefined
        ): Promise<Action> {
          throw new Error("Function not implemented.");
        },
        recover: function (options?: SaveOptions | undefined): Promise<Action> {
          throw new Error("Function not implemented.");
        },
        reload: function (): Promise<void> {
          throw new Error("Function not implemented.");
        },
      });

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
            email: email,
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
    console.log("Se ha solicitado una actualización de la entidad Cliente.");
    const { password, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email no existe" });

    const clienteExist: any = await Client.findOneBy({
      email: email,
    });

    if (clienteExist) {
      const result = await Client.update(clienteExist, {
        password: password,
      });

      if (result) {
        await insertBitacora({
          nameTableAction: "client",
          idTableAction: clienteExist.id,
          idClient: clienteExist.id,
          emailIdentifier: clienteExist.email,
          actionDetail: `Se actualizó la contraseña del Email: "${clienteExist.email}"`,
          hasId: function (): boolean {
            throw new Error("Function not implemented.");
          },
          save: function (options?: SaveOptions | undefined): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          remove: function (
            options?: RemoveOptions | undefined
          ): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          softRemove: function (
            options?: SaveOptions | undefined
          ): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          recover: function (
            options?: SaveOptions | undefined
          ): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          reload: function (): Promise<void> {
            throw new Error("Function not implemented.");
          },
        });
        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    console.log("Se ha solicitado la eliminación de una entidad Cliente.");
    const { id } = req.params;
    if (!id) return res.status(404).json(await error(res.statusCode));

    const clienteExist: any = await Client.findOneBy({
      id: id,
    });

    if (clienteExist) {
      const result: any = await Client.delete(id);
      if (result) {
        await insertBitacora({
          nameTableAction: "client",
          idTableAction: clienteExist.id,
          idClient: clienteExist.id,
          emailIdentifier: clienteExist.email,
          actionDetail: `Se Eliminó el cliente con Email: "${clienteExist.email}"`,
          hasId: function (): boolean {
            throw new Error("Function not implemented.");
          },
          save: function (options?: SaveOptions | undefined): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          remove: function (
            options?: RemoveOptions | undefined
          ): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          softRemove: function (
            options?: SaveOptions | undefined
          ): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          recover: function (
            options?: SaveOptions | undefined
          ): Promise<Action> {
            throw new Error("Function not implemented.");
          },
          reload: function (): Promise<void> {
            throw new Error("Function not implemented.");
          },
        });
        return result
          ? res
              .status(200)
              .json(await success({ data: result }, res.statusCode))
          : res.status(422).json(await error(res.statusCode));
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(await error(res.statusCode));
  }
};
