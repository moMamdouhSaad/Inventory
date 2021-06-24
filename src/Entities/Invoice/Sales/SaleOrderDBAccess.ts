import dbConnection from "../../../db/connection";
import {
  Company,
  DBCrudHandle,
  ProductOrderLine,
  RowEffection,
} from "../../../Shared/Model";
import { SaleOrderInsertationDB } from "./model";

export class SaleOrderDBAccess {
  constructor() {}

  public async insert(
    order: SaleOrderInsertationDB,
    productsOrderLines: ProductOrderLine[]
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const SaleOrderResults = await pool
            .request()
            .input("client_id", order.clientId)
            .input("sub_total", order.subTotal)
            .input("discount_rate", order.discountRate)
            .input("discount_value", order.discountvalue)
            .input("tax_rate", order.taxRate)
            .input("tax_value", order.taxValue)
            .input("total_price", order.totalPrice)
            .input("debit", order.debit)
            .execute("Insert_Into_Sale_Order_AND_Client_Account");

          if (SaleOrderResults) {
            console.log(SaleOrderResults);
            const pool2 = await dbConnection();
            if (pool2) {
              let saledOrderLine;
              productsOrderLines.forEach(async (x) => {
                saledOrderLine = await pool2
                  .request()
                  .input("order_id", null)
                  .input("product_id", x.productId)
                  .input("qty", x.qty)
                  .input("sale_price", x.price)
                  .input("total_price", x.total)
                  .execute("Insert_Sale_Order_Line");
              });
            }
          }

          console.log(SaleOrderResults);

          if (SaleOrderResults.rowsAffected[0] > 0) {
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

  public async getAll(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool.request().execute("Get_All_Sale_Order");
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
          const solResults = await pool
            .request()
            .input("id", id)
            .execute("Get_Sale_Order_Lines_By_OderId");

          const saleOrderResults = await pool
            .request()
            .input("id", id)
            .execute("Get_Sale_Order_By_ID");
          const order = {
            details: saleOrderResults.recordset[0],
            lines: solResults.recordset,
          };

          resolve(order);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
