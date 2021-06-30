import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../../../Server/BaseRequestHandler";
import { Utils } from "../../../Server/utils";
import { HTTP_CODES, HTTP_METHODS } from "../../../Shared/Model";
import { OrderRequestJson, OrderInsertationDB } from "../order-model";
import { PurchaseOrderDBAccess } from "./PurchaseOrderDBAccess";
import { PurchaseOrder } from "./PurchaseOrder";

export class PurchaseOrderRoutesHandler extends BaseRequestHandler {
  private purchaseOrderDBAccess: PurchaseOrderDBAccess =
    new PurchaseOrderDBAccess();
  private parsedUrl: UrlWithParsedQuery | undefined;

  public constructor(req: IncomingMessage, res: ServerResponse) {
    super(req, res);
    this.parsedUrl = Utils.getUrlParameters(this.req.url);
  }
  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handleGet();
        break;

      case HTTP_METHODS.POST:
        await this.handlePost();
        break;

      default:
        this.handleNotFound();
        break;
    }
  }

  // Implementation

  private async handlePost(): Promise<void> {
    try {
      const requestOrder: OrderRequestJson = await this.getRequestBody();
      const purchaseOrder: PurchaseOrder = new PurchaseOrder(
        requestOrder.consumer,
        requestOrder.productsOrderLines
      );
      console.log(purchaseOrder);
      const order: OrderInsertationDB = {
        consumerId: purchaseOrder.getConsumerId(),
        discountRate: purchaseOrder.getDiscountRate(),
        discountvalue: purchaseOrder.getDiscountValue(),
        subTotal: purchaseOrder.getSubtotal(),
        totalPrice: purchaseOrder.getTotal(),
        taxRate: purchaseOrder.getTaxRate(),
        taxValue: purchaseOrder.getTaxValue(),
        debit: requestOrder.debit,
      };
      console.log(order);

      await this.purchaseOrderDBAccess.insert(
        order,
        requestOrder.productsOrderLines
      );
      this.respondText(HTTP_CODES.CREATED, `Order inserted successfully`);
    } catch (error: Error | any) {
      console.log(error.message);
      this.respondBadRequest(error.message);
    }
  }

  private async handleGet(): Promise<void> {
    try {
      if (this.parsedUrl) {
        if (this.parsedUrl.query.id) {
          const id = this.parsedUrl.query.id as string;
          const result = await this.purchaseOrderDBAccess.getById(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (this.parsedUrl.query.cid) {
          const id = this.parsedUrl.query.cid as string;
          const result = await this.purchaseOrderDBAccess.getByConsumerId(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (
          this.parsedUrl.query.from &&
          this.parsedUrl.query.to &&
          this.parsedUrl?.query.page_no &&
          this.parsedUrl?.query.limit
        ) {
          const pageNo = this.parsedUrl.query.page_no as string;
          const limit = this.parsedUrl.query.limit as string;
          const from = this.parsedUrl.query.from as string;
          const to = this.parsedUrl.query.to as string;
          const result = await this.purchaseOrderDBAccess.getByDateRange(
            from,
            to,
            pageNo,
            limit
          );
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match date");
        } else if (
          this.parsedUrl.query.from &&
          this.parsedUrl.query.to &&
          this.parsedUrl.query.cid &&
          this.parsedUrl?.query.page_no &&
          this.parsedUrl?.query.limit
        ) {
          const from = this.parsedUrl.query.from as string;
          const to = this.parsedUrl.query.to as string;
          const cid = this.parsedUrl.query.cid as string;
          const pageNo = this.parsedUrl.query.page_no as string;
          const limit = this.parsedUrl.query.limit as string;

          const result =
            await this.purchaseOrderDBAccess.getByConsumerIdAndDateRange(
              cid,
              from,
              to,
              pageNo,
              limit
            );
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match date");
        } else if (
          this.parsedUrl?.query.page_no &&
          this.parsedUrl?.query.limit
        ) {
          const pageNo = this.parsedUrl.query.page_no as string;
          const limit = this.parsedUrl.query.limit as string;
          const result = await this.purchaseOrderDBAccess.getAll(pageNo, limit);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNotFound();
        }
      } else {
        this.respondBadRequest("Wrong with parsed url");
      }
    } catch (error: Error | any) {
      this.respondBadRequest(error.message);
    }
  }
}
