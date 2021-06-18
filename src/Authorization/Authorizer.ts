import {
  Account,
  SessionToken,
  TokenGenerator,
  TokenRight,
  TokenState,
  TokenValidator,
} from "../Server/Model";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

export class Authorizer implements TokenGenerator, TokenValidator {
  public async validateToken(tokenId: string): Promise<TokenRight> {
    const token = await this.sessionTokenDBAccess.getToken(tokenId);

    if (!token || !token.valid) {
      return {
        accessRights: [],
        state: TokenState.INVALID,
      };
    } else if (token.expirationTime < new Date()) {
      return {
        accessRights: [],
        state: TokenState.EXPIRED,
      };
    } else {
      return {
        accessRights: token.accessRights,
        state: TokenState.VALID,
      };
    }
  }

  private userCredentialsDBAccess: UserCredentialsDBAccess =
    new UserCredentialsDBAccess();
  private sessionTokenDBAccess: SessionTokenDBAccess =
    new SessionTokenDBAccess();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const user = await this.userCredentialsDBAccess.getUserCredentials(
      account.username,
      account.password
    );
    if (user) {
      const token: SessionToken = {
        username: user.username,
        accessRights: user.accessRights,
        valid: true,
        expirationTime: this.generateExpirationTime(),
        tokenId: this.generateRandomTokenId(),
      };
      await this.sessionTokenDBAccess.storeSessionToken(token);
      return token;
    } else {
      return undefined;
    }
  }

  private generateExpirationTime(): Date {
    return new Date(Date.now() + 60 * 60 * 1000);
  }

  private generateRandomTokenId() {
    return Math.random().toString(36).slice(2);
  }
}
