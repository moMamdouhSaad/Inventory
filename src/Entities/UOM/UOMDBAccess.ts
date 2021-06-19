import dbConnection from "../../db/connection";
import { Uom, DBCrudHandle, RowEffection } from "../../Shared/Model";

export class UOMDBAccess implements DBCrudHandle {
  constructor() {}

  public async insert(uom: Uom): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("name", uom.name)
            .input("description", uom.description)
            .execute("Insert_Into_Uom");
          if (results.rowsAffected[0] > 0) {
            resolve(RowEffection.AFFECTED);
          } else {
            resolve(RowEffection.NON_AFFECTED);
          }
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async update(uom: Uom): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("id", uom.id)
            .input("name", uom.name)
            .input("description", uom.description)
            .execute("Update_Uom");
          console.log(results);
          if (results.rowsAffected[0] > 0) {
            resolve(RowEffection.AFFECTED);
          } else {
            throw new Error("Error with request body?");
          }
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
          const results = await pool.request().execute("Get_All_Uom");
          resolve(results.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getByName(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("name", name)
            .execute("Get_Uom_By_Name");
          resolve(results.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  getById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  deleteByID(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
