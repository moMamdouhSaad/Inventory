import { Client, ProductOrderLine, Supplier } from "../../Shared/Model";

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

  public getTotal(): number {
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

  private _getTotal(): number {
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
