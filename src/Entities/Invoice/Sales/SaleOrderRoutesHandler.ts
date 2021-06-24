import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../../../Server/BaseRequestHandler";
import { Utils } from "../../../Server/utils";
import { HTTP_CODES, HTTP_METHODS } from "../../../Shared/Model";
import { SaleOrderInsertationDB, SaleOrderRequestDB } from "./model";
import { SaleOrderDBAccess } from "./SaleOrderDBAccess";
import { createCheckers } from "ts-interface-checker";
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

  private async handlePost() {
    try {
      const requestOrder: SaleOrderRequestDB = await this.getRequestBody();
      const test: SalesOrder = new SalesOrder(
        requestOrder.client,
        requestOrder.productsOrderLines
      );
      const order: SaleOrderInsertationDB = {
        clientId: test.getConsumerId(),
        discountRate: test.getDiscountRate(),
        discountvalue: test.getDiscountValue(),
        subTotal: test.getSubtotal(),
        totalPrice: test.getTotal(),
        taxRate: test.getTaxRate(),
        taxValue: test.getTaxValue(),
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
        } else {
          const result = await this.saleOrderDBAccess.getAll();
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