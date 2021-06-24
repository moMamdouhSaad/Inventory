import {
  Client,
  Product,
  ProductOrderLine,
  Supplier,
} from "../../Shared/Model";
import { SaleOrderInsertationDB } from "./Sales/model";

export abstract class BaseInvoice {
  private consumer: Client | Supplier;
  private productsOrderLines: ProductOrderLine[];
  private subTotal: number = 0;
  private taxRate: number = 0;
  private taxValue: number = 0;
  private discountRate: number = 0;
  private discountValue: number = 0;
  private total: number = 0;

  constructor(
    consumer: Client | Supplier,
    productsOrder: ProductOrderLine[],
    discountRate?: number,
    taxRate?: number
  ) {
    this.consumer = consumer;
    this.productsOrderLines = productsOrder;
    discountRate ? (this.discountRate = discountRate) : 0;
    taxRate ? (this.taxRate = taxRate) : 0;
    this.calculateValues();
  }

  //   interfaces

  public getConsumerId(): number {
    return this.consumer.id;
  }
  public getSubtotal(): number {
    return this._getSubtotal();
  }

  public getTotal() {
    return this._getTotal();
  }

  public getDiscountValue(): number {
    return this._getDiscountValue();
  }

  public getTaxValue(): number {
    return this._getTaxValue();
  }

  public getProductsLines(): ProductOrderLine[] {
    return this._getProductsLines();
  }

  public getTaxRate(): number {
    return this.taxRate;
  }

  public getDiscountRate(): number {
    return this.discountRate;
  }

  // implementation

  private _getProductsLines(): ProductOrderLine[] {
    return this.productsOrderLines;
  }

  private _getSubtotal(): number {
    let total = 0;
    this.productsOrderLines.forEach((x) => (total += x.total));
    return total;
  }

  private calculateValues(): void {
    this.subTotal = this._getSubtotal(); // 1
    this._getTaxValue(); // 2
    this._getDiscountValue(); // 3
    this._getTotal(); // 4
  }

  private _getTotal() {
    this.total = this.subTotal + this.taxValue + this.discountValue;
    return this.total;
  }

  private _getDiscountValue(): number {
    this.discountValue = this.discountRate * this.subTotal;
    return this.discountValue;
  }

  private _getTaxValue(): number {
    this.taxValue = this.taxRate * this.subTotal;
    return this.taxValue;
  }
}

// export class OrderProduct {
//   private product: Product;
//   private qty: number;
//   private price: number;
//   private total: number;

//   constructor(product: Product, qty: number, price: number) {
//     this.product = product;
//     this.qty = qty;
//     this.price = price;
//     this.total = 0;
//   }

//   public getProduct(): Product {
//     return this.product;
//   }
//   public getQty(): number {
//     return this.qty;
//   }
//   public getPrice() {
//     return this.price;
//   }

//   public getTotal(): number {
//     this.total = this.price * this.qty;
//     return this.total;
//   }
// }
// /* -------------------------------- */
// export class OrderProducts {
//   private productsOrder: ProductOrderLine[];

//   constructor(productsOrder: ProductOrderLine[]) {
//     this.productsOrder = productsOrder;
//   }
// }

/* -------------------------------- */
const saleProduct: Product[] = [
  {
    id: 14,
    barcode: "new two",
    name: "new two",
    description: null,
    stock_qty: 90,
    price: 80,
    is_active: true,
  },
  {
    id: 16,
    barcode: "45g6fd4g6df",
    name: "cola-pepsi",
    description: null,
    stock_qty: 90,
    price: 80,
    is_active: true,
  },
];

const productSaleLines: ProductOrderLine[] = [
  { productId: saleProduct[0].id, qty: 5, price: 80, total: 400 },
  { productId: saleProduct[1].id, qty: 2, price: 25, total: 50 },
];

const client: Client = {
  id: 3,
  name: "second client",
  address: "address",
  phone: "0106621416",
  deleted: 0,
};

// const order = new BaseInvoice(client, productSaleLines);
// const sentOrder: SaleOrderInsertationDB = {
//   clientId: 1,
//   subTotal: order.getSubtotal(),
//   taxValue: order.getTaxValue(),
//   discountRate: order.getDiscountRate(),
//   taxRate: order.getTaxRate(),
//   discountvalue: order.getDiscountValue(),
//   totalPrice: order.getTotal(),
//   debit: 50,
// };
// const orderItems = {
//   items: order.getProductsLines(),
// };
// console.log(sentOrder, orderItems);
