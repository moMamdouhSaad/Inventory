import { Client, ProductOrderLine } from "../../../Shared/Model";
import { BaseInvoice } from "../BaseInvoice";

export class SalesOrder extends BaseInvoice {
  constructor(consumer: Client, productsOrderLines: ProductOrderLine[]) {
    super(consumer, productsOrderLines);
  }
}
