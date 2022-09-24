require("dotenv").config();
import app from "./app";
import { connectDB } from "./config/config";
import { DBNAME } from "./environment";

const port = process.env.PORT || 4000;
app.listen(port || 4000, () => {
  console.log("|--------------------------------------------|");
  console.log(`|      Server is running on port ${port} 🚀     |`);
});

const main = async () => {
  await connectDB
    .initialize()
    .then(() => {
      console.log(`|  BASE DE DATOS CONECTADA A: ${DBNAME} 🚘⚽  |`);
      console.log("|--------------------------------------------|");
    })
    .catch((error) =>
      console.log(`ERROR CONEXIÓN BASE DE DATOS: ${error.message}`)
    );
};

main();
