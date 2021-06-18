import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
import { UserDBAccess } from "../User/UserDBAccress";
import { Utils } from "./utils";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { TokenValidator } from "./Model";

export class UsersHandler extends BaseRequestHandler {
  private usersDBAcceess: UserDBAccess = new UserDBAccess();
  private tokenValidator: TokenValidator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenValidator: TokenValidator
  ) {
    super(req, res);
    this.tokenValidator = tokenValidator;
  }

  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handleGet();
        break;
      case HTTP_METHODS.PUT:
        await this.handlePut();
        break;

      case HTTP_METHODS.DELETE:
        await this.handleDelete();
        break;

      default:
        this.handleNotFound();
        break;
    }
  }

  private async operationsAuthorized(operation: AccessRight): Promise<boolean> {
    const tokenId = this.req.headers.authorization;
    if (tokenId) {
      const tokenRights = await this.tokenValidator.validateToken(tokenId);

      if (tokenRights.accessRights.includes(operation)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Privates

  private async handleGet(): Promise<void> {
    const operationAuthorized = await this.operationsAuthorized(
      AccessRight.READ
    );
    if (operationAuthorized) {
      const parsedeUrl = Utils.getUrlParameters(this.req.url);

      if (parsedeUrl?.query.id) {
        const user = await this.usersDBAcceess.getUserById(
          parsedeUrl?.query.id as string
        );
        if (user) {
          this.respondJsonObject(HTTP_CODES.OK, user);
        } else {
          this.handleNotFound();
        }
      } else if (parsedeUrl?.query.name) {
        const users = await this.usersDBAcceess.getUserByName(
          parsedeUrl?.query.name as string
        );
        this.respondJsonObject(HTTP_CODES.OK, users);
      } else {
        this.respondBadRequest("user id or name is required");
      }
    } else {
      this.respondNotAthorized("Missed or Invalid Authentication");
    }
  }

  private async handlePut(): Promise<void> {
    const operationAuthorized = await this.operationsAuthorized(
      AccessRight.CREATE
    );

    if (operationAuthorized) {
      try {
        const user: User = await this.getRequestBody();
        await this.usersDBAcceess.putUser(user);
        this.respondText(HTTP_CODES.CREATED, `user ${user.name} created`);
      } catch (error: Error | any) {
        this.respondBadRequest(error.message);
      }
    } else {
      this.respondNotAthorized("Missed or Invalid Authentication");
    }
  }

  private async handleDelete(): Promise<void> {
    const operationAuthorized = await this.operationsAuthorized(
      AccessRight.DELETE
    );
    if (operationAuthorized) {
      const parsedeUrl = Utils.getUrlParameters(this.req.url);
      if (parsedeUrl) {
        if (parsedeUrl.query.id) {
          const deleteResults = await this.usersDBAcceess.deleteUserById(
            parsedeUrl.query.id as string
          );
          if (deleteResults) {
            this.respondText(
              HTTP_CODES.OK,
              `user ${parsedeUrl.query.id} deleted successfully`
            );
          } else {
            this.respondText(
              HTTP_CODES.NOT_FOUND,
              `user ${parsedeUrl.query.id} was not deleted `
            );
          }
        } else {
          this.respondBadRequest("missing id parameter");
        }
      }
    }
  }
}
