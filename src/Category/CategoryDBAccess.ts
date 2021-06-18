import dbConnection from "../db/connection";
import { Category, RowEffection } from "../Shared/Model";

export class CategoyDBAccess {
  constructor() {}

  public async insertCategory(categry: Category): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const categories = await pool
            .request()
            .input("name", categry.name)
            .input("description", categry.description)
            .execute("Insert_Into_Category");
          if (categories.rowsAffected[0] > 0) {
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

  public async updateCategory(categry: Category): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("id", categry.id)
            .input("name", categry.name)
            .input("description", categry.description)
            .execute("Update_Category");
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

  public async getAllCategories(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const categories = await pool.request().execute("Get_All_Categories");
          resolve(categories.recordsets);
        } else {
          console.log("connection error");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getCategoryById(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const categories = await pool
            .request()
            .input("id", id)
            .execute("Get_Category_By_ID");
          resolve(categories.recordset[0]);
        } else {
          console.log("connection error");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getCategoryByName(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const categories = await pool
            .request()
            .input("name", name)
            .execute("Get_Category_By_Name");
          resolve(categories.recordsets);
          pool.close();
        } else {
          console.log("connection error");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async deleteCategoryByID(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("id", id)
            .execute("Delete_Category");
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
}

const test = new CategoyDBAccess();

const category: Category = {
  id: 1,
  name: "latest",
  description: "desc2 updated",
};

// test.insertCategory(category).then(
//   (data) => console.log(data),
//   (err) => console.log(err)
// );

test.updateCategory(category).then(
  (data) => console.log(data),
  (err) => console.log(err)
);

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
