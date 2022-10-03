import { DataSource } from "typeorm";
import { DBOPTIONS } from "../environment";

const { DBHOST, DBNAME, DBPASS, DBUSER } = DBOPTIONS;
export const connectDB = new DataSource({
  type: "postgres",
  host: "172.105.149.33",
  port: 5432,
  username: DBUSER,
  password: DBPASS,
  database: DBNAME,
  entities: ["src/entities_DB/*.ts"],
  synchronize: true,
});
