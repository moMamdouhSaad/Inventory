import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../Server/BaseRequestHandler";
import { Utils } from "../Server/utils";
import { Company, HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { CompanyDBAccess } from "./CompanyDBAccess";

export class CompanyRoutesHandler extends BaseRequestHandler {
  private companyDBAccess: CompanyDBAccess = new CompanyDBAccess();
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
          const result = await this.companyDBAccess.getById(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (this.parsedUrl?.query.name) {
          const name = this.parsedUrl.query.name as string;
          const result = await this.companyDBAccess.getByName(name);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Name");
        } else {
          const result = await this.companyDBAccess.getAll();
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
      const company: Company = await this.getRequestBody();
      await this.companyDBAccess.update(company);
      this.respondText(
        HTTP_CODES.CREATED,
        `Company with id ${company.id} Updated successfully`
      );
    } catch (error: Error | any) {
      this.respondBadRequest(error.message);
    }
  }

  private async handlePost() {
    try {
      const company: Company = await this.getRequestBody();
      await this.companyDBAccess.insert(company);
      this.respondText(
        HTTP_CODES.CREATED,
        `Company  ${company.name} inserted successfully`
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
        const result = await this.companyDBAccess.deleteByID(id);
        if (result) {
          this.respondText(HTTP_CODES.OK, `Company ${id} deleted successfully`);
        } else {
          this.respondText(
            HTTP_CODES.NOT_FOUND,
            `Company ${id} was not deleted `
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
