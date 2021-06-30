import dbConnection from "../../../db/connection";
import { ProductOrderLine, RowEffection } from "../../../Shared/Model";
import { OrderFunctionalInterface, OrderInsertationDB } from "../order-model";

export class SaleOrderDBAccess implements OrderFunctionalInterface {
  constructor() {}

  public async insert(
    order: OrderInsertationDB,
    productsOrderLines: ProductOrderLine[]
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        const pool2 = await dbConnection();

        if (pool) {
          await this.checkQtysAvailability(productsOrderLines);

          const SaleOrderResults = await pool
            .request()
            .input("client_id", order.consumerId)
            .input("sub_total", order.subTotal)
            .input("discount_rate", order.discountRate)
            .input("discount_value", order.discountvalue)
            .input("tax_rate", order.taxRate)
            .input("tax_value", order.taxValue)
            .input("total_price", order.totalPrice)
            .input("debit", order.debit)
            .execute("Insert_Into_Sale_Order_AND_Client_Account");

          if (pool2) {
            let orderLine;
            productsOrderLines.forEach(async (x) => {
              orderLine = await pool2
                .request()
                .input("order_id", null)
                .input("product_id", x.productId)
                .input("qty", x.qty)
                .input("sale_price", x.price)
                .input("total_price", x.total)
                .execute("Insert_Sale_Order_Line");
            });

            if (SaleOrderResults.rowsAffected[0] > 0) {
              resolve(RowEffection.AFFECTED);
            } else {
              resolve(RowEffection.NON_AFFECTED);
            }
          }

          pool.close();
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  public async getAll(pageNo: string, limit: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool
            .request()
            .input("offset", pageNo)
            .input("limit", limit)
            .execute("Get_All_Sale_Order");
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

  public async getByConsumerId(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool
            .request()
            .input("id", id)
            .execute("Get_Sale_Order_By_ClientID");
          resolve(result.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getByConsumerIdAndDateRange(
    id: string,
    from: string,
    to: string,
    pageNo: string,
    limit: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool
            .request()
            .input("id", id)
            .input("from", from)
            .input("to", to)
            .input("offset", pageNo)
            .input("limit", limit)
            .execute("Get_Sale_Order_By_ClientID_And_DateRange");
          resolve(result.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getByDateRange(
    from: string,
    to: string,
    pageNo: string,
    limit: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool
            .request()
            .input("from", from)
            .input("to", to)
            .input("offset", pageNo)
            .input("limit", limit)
            .execute("Get_Sale_Order_By_Date_Range");

          resolve(result.recordset);
        } else {
          throw new Error("Error with database connection");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  private async checkQtysAvailability(
    productLines: ProductOrderLine[]
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          productLines.forEach(async (x, i) => {
            const product = await pool
              .request()
              .input("id", x.productId)
              .execute("Get_Product_By_ID");
            if (product.recordset[0].stock_qty < x.qty) {
              reject({ message: "stock qty erroooooooor" });
            } else if (i === productLines.length - 1) {
              resolve("nice");
            }
          });
        }
      } catch (error) {
        reject(error.message);
      }
    });
  }
}
