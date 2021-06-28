import dbConnection from "../../../db/connection";
import { ProductOrderLine, RowEffection } from "../../../Shared/Model";
import { OrderFunctionalInterface, OrderInsertationDB } from "../order-model";

export class PurchaseOrderDBAccess implements OrderFunctionalInterface {
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
          const purchaseOrderResults = await pool
            .request()
            .input("supplier_id", order.consumerId)
            .input("sub_total", order.subTotal)
            .input("discount_rate", order.discountRate)
            .input("discount_value", order.discountvalue)
            .input("tax_rate", order.taxRate)
            .input("tax_value", order.taxValue)
            .input("total_price", order.totalPrice)
            .input("debit", order.debit)
            .execute("Insert_Into_Purchase_Order_AND_Supplier_Account");

          if (pool2) {
            let orderLine;
            console.log(productsOrderLines);
            productsOrderLines.forEach(async (x) => {
              orderLine = await pool2
                .request()
                .input("order_id", null)
                .input("product_id", x.productId)
                .input("qty", x.qty)
                .input("purchase_price", x.price)
                .input("total_price", x.total)
                .execute("Insert_Purchase_Order_Line");
            });

            if (purchaseOrderResults.rowsAffected[0] > 0) {
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

  public async getAll(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await dbConnection();
        if (pool) {
          const result = await pool.request().execute("Get_All_Purchase_Order");
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
            .execute("Get_Purchase_Order_Lines_By_OderId");

          const purchaseOrderResults = await pool
            .request()
            .input("id", id)
            .execute("Get_Purchase_Order_By_ID");

          const order = {
            details: purchaseOrderResults.recordset[0],
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
            .execute("Get_Purchase_Order_By_SupplierID");
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
    to: string
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
            .execute("Get_Purchase_Order_By_SupplierID_And_DateRange");
          resolve(result.recordset);
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
            .execute("Get_Purchase_Order_By_Date_Range");

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
