import { IncomingMessage, ServerResponse } from "http";
import { Account, TokenGenerator } from "./Model";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { BaseRequestHandler } from "./BaseRequestHandler";

export class LoginHandler extends BaseRequestHandler {
  private tokenGenerator: TokenGenerator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenGenerator: TokenGenerator
  ) {
    super(req, res);
    this.tokenGenerator = tokenGenerator;
  }

  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.POST:
        await this.handlePost();
        break;

      default:
        this.handleNotFound();
        break;
    }
  }

  private async handlePost() {
    try {
      const body: Account = await this.getRequestBody();
      console.log(body);
      const sessionToken = await this.tokenGenerator.generateToken(body);

      if (sessionToken) {
        this.res.statusCode = HTTP_CODES.CREATED;
        this.res.writeHead(HTTP_CODES.CREATED, {
          "Content-Type": "application/json",
        });
        this.res.write(JSON.stringify(sessionToken));
      } else {
        this.res.statusCode = HTTP_CODES.UNAUTHORIZED;
        this.res.write("Wrong username or password");
      }
    } catch (error) {
      this.res.write("handleRequest error " + error.message);
    }
  }
}
