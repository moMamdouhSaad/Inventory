import dbConnection from "../db/connection";
import { Company, DBCrudHandle, RowEffection } from "../Shared/Model";

export class CompanyDBAccess implements DBCrudHandle {
  constructor() {}

  public async insert(company: Company): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("name", company.name)
            .input("description", company.description)
            .execute("Insert_Into_Company");
          if (results.rowsAffected[0] > 0) {
            resolve(RowEffection.AFFECTED);
          } else {
            resolve(RowEffection.NON_AFFECTED);
          }
          pool.close();
        } else {
          console.log("connection error");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async update(company: Company): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("id", company.id)
            .input("name", company.name)
            .input("description", company.description)
            .execute("Update_Company");
          if (results.rowsAffected[0] > 0) {
            resolve(RowEffection.AFFECTED);
          } else {
            throw new Error("Error with request body");
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

  public async getAll(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool.request().execute("Get_All_Companies");
          resolve(result.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getById(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("id", id)
            .execute("Get_Company_By_ID");
          resolve(results.recordset[0]);
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
            .execute("Get_Company_By_Name");
          resolve(results.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async deleteByID(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("id", parseInt(id))
            .execute("Delete_Company");
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
}

// const test = new CompanyDBAccess();

// const company: Company = {
//   id: 1,
//   name: "latest",
//   description: "desc2 updated",
// };

// test.insertCategory(category).then(
//   (data) => console.log(data),
//   (err) => console.log(err)
// );

// test.update(company).then(
//   (data) => console.log(data),
//   (err) => console.log(err)
// );

// test.getAllCategories().then(
//   (data) => console.log(data),
//   (err) => console.log(err)
// );

// test.getCategoryById("5").then(
//   (data) => console.log(data),
//   (err) => console.log(err)
// );

// test.getCategoryByName("test2").then(
//   (data) => console.log(data),
//   (err) => console.log(err)
// );

// test.deleteCategoryByID(2).then(
//   (data) => console.log(data),
//   (err) => console.log(err)
// );
