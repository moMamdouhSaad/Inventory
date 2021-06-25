import dbConnection from "../../db/connection";
import { RowEffection } from "../../Shared/Model";
import { ClientAccountDbInsertation } from "./mode";

export class ClientAccountDBAccess {
  constructor() {}

  public async insert(
    ClientAccountDbInsertation: ClientAccountDbInsertation
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("client_id", ClientAccountDbInsertation.clientId)
            .input("debit", ClientAccountDbInsertation.debit)
            .execute("Insert_Into_Client_Account");
          if (results.rowsAffected[0] > 0) {
            resolve(RowEffection.AFFECTED);
          } else {
            resolve(RowEffection.NON_AFFECTED);
          }
          pool.close();
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getByClientId(clientId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool
            .request()
            .input("client_id", clientId)
            .execute("Get_Balance_Client_Account_By_Id");
          resolve(result.recordset[0]);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getAll(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool.request().execute("Get_Balance_Client");
          resolve(result.recordset[0]);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  public async getByClientIdAndDateRange(
    cid: string,
    from: string,
    to: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          console.log(cid, from, to);
          const result = await pool
            .request()
            .input("client_id", cid)
            .input("from", from)
            .input("to", to)
            .execute("Get_Client_Account_By_ClientID_And_DateRange");
          resolve(result.recordset[0]);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  public async getByDateRange(from: string, to: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool
            .request()
            .input("from", from)
            .input("to", to)
            .execute("Get_Client_Account_By_Date_Range");

          resolve(result.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
