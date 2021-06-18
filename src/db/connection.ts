import mssql = require("mssql/msnodesqlv8");
import db from "./db.config";

const dbConnection = async () => {
  try {
    const connection = await new mssql.ConnectionPool(db);
    const pool = await connection.connect();
    console.log("SQL DATABASE CONNECTED");
    return pool;
  } catch (e) {
    console.log(e);
  }
};
export default dbConnection;
