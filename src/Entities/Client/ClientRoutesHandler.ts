import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../../Server/BaseRequestHandler";
import { Utils } from "../../Server/utils";
import { Client, HTTP_CODES, HTTP_METHODS } from "../../Shared/Model";
import { ClientDBAccess } from "./ClientDBAccess";

export class ClientRoutesHandler extends BaseRequestHandler {
  private clientDBAccess: ClientDBAccess = new ClientDBAccess();
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
          const result = await this.clientDBAccess.getById(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (this.parsedUrl?.query.name) {
          const name = this.parsedUrl.query.name as string;
          const result = await this.clientDBAccess.getByName(name);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Name");
        } else {
          const result = await this.clientDBAccess.getAll();
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
      const client: Client = await this.getRequestBody();
      await this.clientDBAccess.update(client);
      this.respondText(
        HTTP_CODES.CREATED,
        `Client with id ${client.id} Updated successfully`
      );
    } catch (error: Error | any) {
      this.respondBadRequest(error.message);
    }
  }

  private async handlePost() {
    try {
      const client: Client = await this.getRequestBody();
      await this.clientDBAccess.insert(client);
      this.respondText(
        HTTP_CODES.CREATED,
        `client  ${client.name} inserted successfully`
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
        const result = await this.clientDBAccess.deleteByID(id);
        if (result) {
          this.respondText(HTTP_CODES.OK, `Client ${id} deleted successfully`);
        } else {
          this.respondText(
            HTTP_CODES.NOT_FOUND,
            `Client ${id} was not deleted `
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
