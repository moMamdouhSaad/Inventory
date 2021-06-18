import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../Shared/Model";

export abstract class BaseRequestHandler {
  protected req: IncomingMessage;
  protected res: ServerResponse;

  public constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  abstract handleRequest(): Promise<void>;

  protected handleNotFound() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write("page not found");
  }

  protected async getRequestBody(): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = "";

      // ON DATA
      this.req.on("data", (data: string) => {
        body += data;
      });

      // ON END
      this.req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });

      // ON ERROR
      this.req.on("error", (err: any) => {
        reject(err);
      });
    });
  }

  protected respondJsonObject(code: HTTP_CODES, object: any) {
    this.res.writeHead(code, {
      "content-type": "application/json",
    });
    this.res.write(JSON.stringify(object));
  }

  protected respondBadRequest(message: string) {
    this.res.statusCode = HTTP_CODES.BAD_REQUEST;
    this.res.write(message);
  }

  protected respondNotAthorized(message: string) {
    this.res.statusCode = HTTP_CODES.UNAUTHORIZED;
    this.res.write(message);
  }

  protected respondText(httpCode: HTTP_CODES, message: string) {
    this.res.statusCode = httpCode;
    this.res.write(message);
  }
}
