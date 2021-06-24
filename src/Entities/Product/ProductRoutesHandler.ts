import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../../Server/BaseRequestHandler";
import { Utils } from "../../Server/utils";
import { HTTP_CODES, HTTP_METHODS, Product } from "../../Shared/Model";
import { ProductDBAccess } from "./ProductDBAccess";

export class ProductRoutesHandler extends BaseRequestHandler {
  private productDBAccess: ProductDBAccess = new ProductDBAccess();
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

      case HTTP_METHODS.PUT:
        await this.handleUpdate();
        break;

      case HTTP_METHODS.DELETE:
        await this.handleDelete();
        break;

      default:
        this.handleNotFound();
        break;
    }
  }

  // Implementation
  private async handlePost() {
    try {
      const product: Product = await this.getRequestBody();
      await this.productDBAccess.insert(product);
      this.respondText(
        HTTP_CODES.CREATED,
        `Product  ${product.name} inserted successfully`
      );
    } catch (error: Error | any) {
      console.log(error);
      this.respondBadRequest(error.message);
    }
  }

  private async handleGet(): Promise<void> {
    try {
      if (this.parsedUrl) {
        if (this.parsedUrl.query.id) {
          const id = this.parsedUrl.query.id as string;
          const result = await this.productDBAccess.getById(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (this.parsedUrl?.query.name) {
          const name = this.parsedUrl.query.name as string;
          const result = await this.productDBAccess.getByName(name);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Name");
        } else {
          const result = await this.productDBAccess.getAll();
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

  private async handleUpdate(): Promise<void> {
    try {
      const product: Product = await this.getRequestBody();
      await this.productDBAccess.update(product);
      this.respondText(
        HTTP_CODES.CREATED,
        `product with id ${product.id} Updated successfully`
      );
    } catch (error: Error | any) {
      this.respondBadRequest(error.message);
    }
  }

  private async handleDelete(): Promise<void> {
    try {
      if (this.parsedUrl?.query.id) {
        const id = this.parsedUrl.query.id as string;
        const result = await this.productDBAccess.deleteByID(id);
        if (result) {
          this.respondText(HTTP_CODES.OK, `product ${id} deleted successfully`);
        } else {
          this.respondText(
            HTTP_CODES.NOT_FOUND,
            `Product ${id} was not deleted `
          );
        }
      } else {
        this.respondBadRequest("Wrong with parsed url");
      }
    } catch (error) {
      this.respondBadRequest(error.message);
    }
  }
}
