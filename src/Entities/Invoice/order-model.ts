import { Client, ProductOrderLine, Supplier } from "../../Shared/Model";

export interface OrderInsertationDB {
  consumerId: number;
  subTotal: number;
  discountRate: number;
  discountvalue: number;
  taxRate: number;
  taxValue: number;
  totalPrice: number;
  debit: number;
}

export interface OrderRequestJson {
  consumer: Client | Supplier;
  productsOrderLines: ProductOrderLine[];
  debit: number;
}

export interface OrderFunctionalInterface {
  insert(
    OrderInsertationDB: OrderInsertationDB,
    productsOrderLines: ProductOrderLine[]
  ): Promise<any>;
  getByConsumerId(id: string): Promise<any>;
  getAll(pageNo: string, limit: string): Promise<any>;
  getById(id: string): Promise<any>;
  getByConsumerIdAndDateRange(
    id: string,
    from: string,
    to: string,
    pageNo: string,
    limit: string
  ): Promise<any>;
  getByDateRange(
    from: string,
    to: string,
    pageNo: string,
    limit: string
  ): Promise<any>;
}
