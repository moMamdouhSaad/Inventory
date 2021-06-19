import dbConnection from "../../db/connection";
import {
  Company,
  DBCrudHandle,
  Product,
  RowEffection,
} from "../../Shared/Model";

export class ProductDBAccess implements DBCrudHandle {
  constructor() {}

  public async insert(product: Product): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("barcode", product.barcode)
            .input("name", product.name)
            .input("description", product.description)
            .input("stock_qty", product.stock_qty)
            .input("price", product.price)
            .input("company_id", product.company_id)
            .input("category_id", product.category_id)
            .input("uom_id", product.uom_id)
            .execute("Insert_Into_Product");
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

  public async update(product: Product): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const results = await pool
            .request()
            .input("id", product.id)
            .input("barcode", product.barcode)
            .input("name", product.name)
            .input("description", product.description)
            .input("stock_qty", product.stock_qty)
            .input("price", product.price)
            .input("is_active", product.is_active)
            .input("company_id", product.company_id)
            .input("category_id", product.category_id)
            .input("uom_id", product.uom_id)
            .execute("Update_Product");
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
          const result = await pool.request().execute("Get_All_Products");
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
            .execute("Get_Product_By_ID");
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
            .execute("Get_Product_By_name");
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
            .execute("Delete_Product");
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
