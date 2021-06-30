import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../../../Server/BaseRequestHandler";
import { Utils } from "../../../Server/utils";
import { HTTP_CODES, HTTP_METHODS } from "../../../Shared/Model";
import { OrderRequestJson, OrderInsertationDB } from "../order-model";
import { SaleOrderDBAccess } from "./SaleOrderDBAccess";
import { SalesOrder } from "./SalesOrder";

export class SaleOrderRoutesHandler extends BaseRequestHandler {
  private saleOrderDBAccess: SaleOrderDBAccess = new SaleOrderDBAccess();
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
      const saleOrder: SalesOrder = new SalesOrder(
        requestOrder.consumer,
        requestOrder.productsOrderLines
      );
      const order: OrderInsertationDB = {
        consumerId: saleOrder.getConsumerId(),
        discountRate: saleOrder.getDiscountRate(),
        discountvalue: saleOrder.getDiscountValue(),
        subTotal: saleOrder.getSubtotal(),
        totalPrice: saleOrder.getTotal(),
        taxRate: saleOrder.getTaxRate(),
        taxValue: saleOrder.getTaxValue(),
        debit: requestOrder.debit,
      };

      await this.saleOrderDBAccess.insert(
        order,
        requestOrder.productsOrderLines
      );
      this.respondText(HTTP_CODES.CREATED, `Order  inserted successfully`);
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
          const result = await this.saleOrderDBAccess.getById(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (this.parsedUrl.query.cid) {
          const id = this.parsedUrl.query.cid as string;
          const result = await this.saleOrderDBAccess.getByConsumerId(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (
          this.parsedUrl.query.from &&
          this.parsedUrl.query.to &&
          this.parsedUrl?.query.page_no &&
          this.parsedUrl?.query.limit
        ) {
          const from = this.parsedUrl.query.from as string;
          const to = this.parsedUrl.query.to as string;
          const pageNo = this.parsedUrl.query.page_no as string;
          const limit = this.parsedUrl.query.limit as string;
          const result = await this.saleOrderDBAccess.getByDateRange(
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
            await this.saleOrderDBAccess.getByConsumerIdAndDateRange(
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
          const result = await this.saleOrderDBAccess.getAll(pageNo, limit);
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
