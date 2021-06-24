import { BaseOrderOperation } from "../BaseOrderOperation";

export class SaleOperation extends BaseOrderOperation {
  protected handle(): Promise<boolean> {
    return true;
  }
}
