import { DataSource } from "typeorm";
import { DBOPTIONS } from "../environment";

const { DBHOST, DBNAME, DBPASS, DBUSER } = DBOPTIONS;
export const connectDB = new DataSource({
  type: "postgres",
  host: "45.56.74.204",
  port: 5432,
  username: DBUSER,
  password: DBPASS,
  database: DBNAME,
  entities: ["src/entities_DB/*.{js,ts}"],
  synchronize: true,
});
