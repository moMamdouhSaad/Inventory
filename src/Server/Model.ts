import { AccessRight } from "../Shared/Model";

export interface Account {
  username: string;
  password: string;
}

export interface SessionToken {
  tokenId: string;
  username: string;
  valid: boolean;
  expirationTime: Date;
  accessRights: AccessRight[];
}

export interface TokenRight {
  accessRights: AccessRight[];
  state: TokenState;
}

export enum TokenState {
  VALID,
  INVALID,
  EXPIRED,
}

export interface TokenGenerator {
  generateToken(account: Account): Promise<SessionToken | undefined>;
}

export interface TokenValidator {
  validateToken(tokenId: string): Promise<TokenRight>;
}
