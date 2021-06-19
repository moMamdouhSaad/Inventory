import { createServer, IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { CategoryRoutesHandler } from "../Entities/Category/CategoryRoutesHandler";
import { CompanyRoutesHandler } from "../Entities/Company/CompanyRoutesHandler";
import { LoginHandler } from "./LoginHandler";
import { TokenValidator } from "./Model";
import { UsersHandler } from "./UsersHandler";
import { Utils } from "./utils";
export class Server {
  private authorizer: Authorizer = new Authorizer();

  public myFunc(user: any, handle: any) {
    if (user == "done") {
      handle(null, "my data");
    } else {
      handle("errorrrrrrrrr", null);
    }
  }

  public createServer(): void {
    // test
    this.myFunc("done", (err: any, data: any) => {
      if (data) {
        console.log(data);
      }
      if (err) {
        console.log(err);
      }
    });
    //

    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      console.log("Get request from", req.url?.length);
      const basePath = Utils.getUrlBasePath(req.url);
      switch (basePath) {
        case "login":
          await new LoginHandler(req, res, this.authorizer).handleRequest();
          break;

        case "users":
          await new UsersHandler(req, res, this.authorizer).handleRequest();
          break;

        case "category":
          await new CategoryRoutesHandler(req, res).handleRequest();
          break;

        case "company":
          await new CompanyRoutesHandler(req, res).handleRequest();
          break;

        default:
          break;
      }
      res.end();
    }).listen(3000);

    console.log("server started");
  }
}
