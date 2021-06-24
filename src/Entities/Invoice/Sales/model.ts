import { Client, ProductOrderLine } from "../../../Shared/Model";

export interface SaleOrderInsertationDB {
  clientId: number;
  subTotal: number;
  discountRate: number;
  discountvalue: number;
  taxRate: number;
  taxValue: number;
  totalPrice: number;
  debit: number;
}

export interface SaleOrderRequestDB {
  client: Client;
  productsOrderLines: ProductOrderLine[];
  debit: number;
}
