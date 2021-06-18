import { Account } from "../Server/Model";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export enum RowEffection {
  AFFECTED = 1,
  NON_AFFECTED = 0,
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
