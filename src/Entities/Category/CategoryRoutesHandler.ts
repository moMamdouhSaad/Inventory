import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../../Server/BaseRequestHandler";
import { Utils } from "../../Server/utils";
import {
  Category,
  CrudHandle,
  HTTP_CODES,
  HTTP_METHODS,
} from "../../Shared/Model";
import { CategoyDBAccess } from "./CategoryDBAccess";

export class CategoryRoutesHandler extends BaseRequestHandler {
  private categoryDBAccess: CategoyDBAccess = new CategoyDBAccess();
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

  //   Implementation
  private async handleGet(): Promise<void> {
    try {
      if (this.parsedUrl) {
        if (this.parsedUrl.query.id) {
          const id = this.parsedUrl.query.id as string;
          const result = await this.categoryDBAccess.getById(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (this.parsedUrl?.query.name) {
          const name = this.parsedUrl.query.name as string;
          const result = await this.categoryDBAccess.getByName(name);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Name");
        } else if (
          this.parsedUrl?.query.page_no &&
          this.parsedUrl?.query.limit
        ) {
          const pageNo = this.parsedUrl.query.page_no as string;
          const limit = this.parsedUrl.query.limit as string;

          const result = await this.categoryDBAccess.getAll(pageNo, limit);
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
      const category: Category = await this.getRequestBody();
      await this.categoryDBAccess.update(category);
      this.respondText(
        HTTP_CODES.CREATED,
        `Category with id ${category.id} Updated successfully`
      );
    } catch (error: Error | any) {
      this.respondBadRequest(error.message);
    }
  }

  private async handlePost() {
    try {
      const category: Category = await this.getRequestBody();
      await this.categoryDBAccess.insert(category);
      this.respondText(
        HTTP_CODES.CREATED,
        `Category  ${category.name} inserted successfully`
      );
    } catch (error: Error | any) {
      console.log(error);
      this.respondBadRequest(error.message);
    }
  }

  private async handleDelete(): Promise<void> {
    try {
      if (this.parsedUrl?.query.id) {
        const id = this.parsedUrl.query.id as string;
        const result = await this.categoryDBAccess.deleteByID(id);
        if (result) {
          this.respondText(
            HTTP_CODES.OK,
            `Category ${id} deleted successfully`
          );
        } else {
          this.respondText(
            HTTP_CODES.NOT_FOUND,
            `Category ${id} was not deleted `
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
