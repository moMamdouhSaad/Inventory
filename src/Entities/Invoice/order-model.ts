import { Client, ProductOrderLine } from "../../Shared/Model";

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
  client: Client;
  productsOrderLines: ProductOrderLine[];
  debit: number;
}

export interface OrderFunctionalInterface {
  insert(
    OrderInsertationDB: OrderInsertationDB,
    productsOrderLines: ProductOrderLine[]
  ): Promise<any>;
  getByConsumerId(id: string): Promise<any>;
  getAll(): Promise<any>;
  getById(id: string): Promise<any>;
  getByConsumerIdAndDateRange(
    id: string,
    from: string,
    to: string
  ): Promise<any>;
  getByDateRange(from: string, to: string): Promise<any>;
}
