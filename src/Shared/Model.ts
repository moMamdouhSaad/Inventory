import { Account } from "../Server/Model";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
}

export interface Uom {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;
  description: string | null;
  stock_qty: number;
  price: number;
  is_active: boolean;
  deleted?: boolean;
  company_id?: number;
  category_id?: number;
  uom_id?: number;
  sale_price?: number;
}
export interface ProductOrderLine {
  // came from front end
  productId: number;
  qty: number;
  price: number;
  total: number;
}
export interface OrdernIvoiceLine {
  // register to database
  id: number;
  invoiceId: number;
  productId: number;
  qty: number;
  price: number;
  total: number;
}

export interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  deleted?: 0 | 1;
}

export enum RowEffection {
  AFFECTED = 1,
  NON_AFFECTED = 0,
}

export interface DBCrudHandle {
  insert(categry: any): Promise<any>;
  update(category: any): Promise<any>;
  getAll(): Promise<any>;
  getById(id: string): Promise<any>;
  getByName(name: string): Promise<any>;
  deleteByID(id: string): Promise<any>;
}

export abstract class CrudHandle {
  protected abstract handlePost(): Promise<void>;
  protected abstract handleGet(): Promise<void>;
  protected abstract handlePut(): Promise<void>;
  protected abstract handleDelete(): Promise<void>;
}

export interface UserCredentials extends Account {
  accessRights: AccessRight[];
}

export interface User {
  id: String;
  name: string;
  age: number;
  email: string;
  workingPosition: WorkingPosition;
}

export enum WorkingPosition {
  JUNIOR,
  PROGRAMMER,
  ENGINEER,
  EXPERT,
  MANAGER,
}

// Enums
export enum AccessRight {
  CREATE,
  READ,
  UPDATE,
  DELETE,
}

export enum HTTP_CODES {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
}

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}
