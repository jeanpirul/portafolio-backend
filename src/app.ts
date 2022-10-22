import express from "express"; //Es un marco de aplicación que permite un conjunto de funciones para aplicaciones web y mobiles.
import bodyParser from "body-parser"; //Analiza los cuerpos de las solicitudes entrantes en un middleware antes que sus controladores.
import { router } from "./router"; // Esto nos permite dar acceso a las rutas necesarias
import cors from "cors"; //CORS es un paquete de node.js para proporcionar un middleware Connect / Express
import morgan from "morgan";

export const app = express();

app
  .use(cors())
  .use(morgan("dev"))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(router);

export default app;
