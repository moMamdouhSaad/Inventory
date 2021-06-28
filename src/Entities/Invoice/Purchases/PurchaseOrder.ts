import { ProductOrderLine, Supplier } from "../../../Shared/Model";
import { BaseInvoice } from "../BaseInvoice";

export class PurchaseOrder extends BaseInvoice {
  constructor(consumer: Supplier, productsOrderLines: ProductOrderLine[]) {
    super(consumer, productsOrderLines);
  }
}
