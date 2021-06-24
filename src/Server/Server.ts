import { createServer, IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { CategoryRoutesHandler } from "../Entities/Category/CategoryRoutesHandler";
import { ClientRoutesHandler } from "../Entities/Client/ClientRoutesHandler";
import { CompanyRoutesHandler } from "../Entities/Company/CompanyRoutesHandler";
import { SaleOrderRoutesHandler } from "../Entities/Invoice/Sales/SaleOrderRoutesHandler";
import { ProductRoutesHandler } from "../Entities/Product/ProductRoutesHandler";
import { SupplierRoutesHandler } from "../Entities/Supplier/SupplierRoutesHandler";
import { UOMRoutesHandler } from "../Entities/UOM/UOMRoutesHandler";
import { LoginHandler } from "./LoginHandler";
import { UsersHandler } from "./UsersHandler";
import { Utils } from "./utils";
export class Server {
  private authorizer: Authorizer = new Authorizer();

  public createServer(): void {
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

        case "product":
          await new ProductRoutesHandler(req, res).handleRequest();
          break;

        case "supplier":
          await new SupplierRoutesHandler(req, res).handleRequest();
          break;

        case "client":
          await new ClientRoutesHandler(req, res).handleRequest();
          break;

        case "sales_order":
          await new SaleOrderRoutesHandler(req, res).handleRequest();
          break;

        case "uom":
          await new UOMRoutesHandler(req, res).handleRequest();
          break;

        default:
          break;
      }
      res.end();
    }).listen(3000);

    console.log("server started");
  }
}
