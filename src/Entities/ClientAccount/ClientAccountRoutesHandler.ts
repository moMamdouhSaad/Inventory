import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { BaseRequestHandler } from "../../Server/BaseRequestHandler";
import { Utils } from "../../Server/utils";
import { HTTP_CODES, HTTP_METHODS } from "../../Shared/Model";
import { ClientAccountDBAccess } from "./ClientAccountDBAccess";
import { ClientAccountDbInsertation } from "./mode";

export class ClientAccountRoutesHandler extends BaseRequestHandler {
  private clientAccountDBAccess: ClientAccountDBAccess =
    new ClientAccountDBAccess();
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
        // await this.handleUpdate();
        break;

      case HTTP_METHODS.DELETE:
        // await this.handleDelete();
        break;

      default:
        this.handleNotFound();
        break;
    }
  }

  //   Implementation

  private async handlePost() {
    try {
      const clientAccountDbInsertation: ClientAccountDbInsertation =
        await this.getRequestBody();
      await this.clientAccountDBAccess.insert(clientAccountDbInsertation);
      this.respondText(
        HTTP_CODES.CREATED,
        `client id  ${clientAccountDbInsertation.clientId} inserted successfully`
      );
    } catch (error: Error | any) {
      console.log(error);
      this.respondBadRequest(error.message);
    }
  }

  private async handleGet(): Promise<void> {
    try {
      if (this.parsedUrl) {
        if (this.parsedUrl.query.cid) {
          const id = this.parsedUrl.query.id as string;
          const result = await this.clientAccountDBAccess.getByClientId(id);
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match Id");
        } else if (
          this.parsedUrl.query.from &&
          this.parsedUrl.query.to &&
          this.parsedUrl.query.client_id
        ) {
          const from = this.parsedUrl.query.from as string;
          const to = this.parsedUrl.query.to as string;
          const cid = this.parsedUrl.query.client_id as string;
          const result =
            await this.clientAccountDBAccess.getByClientIdAndDateRange(
              cid,
              from,
              to
            );
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match date");
        } else if (this.parsedUrl.query.from && this.parsedUrl.query.to) {
          const from = this.parsedUrl.query.from as string;
          const to = this.parsedUrl.query.to as string;
          const result = await this.clientAccountDBAccess.getByDateRange(
            from,
            to
          );
          result
            ? this.respondJsonObject(HTTP_CODES.OK, result)
            : this.handleNoContent("Not Match date");
        } else {
          const result = await this.clientAccountDBAccess.getAll();
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
