import { Account, SessionToken, TokenGenerator, TokenRights, TokenState, TokenValidator } from "../Server/Model";
import { CredentialDBAccess } from "./CredentialsDBAccess";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";

export class Authorizer implements TokenGenerator, TokenValidator {

  private credentialDBAccess: CredentialDBAccess = new CredentialDBAccess()
  private sessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess()

  public async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.credentialDBAccess.getCredential(
      account.username, account.password
    )

    if(resultAccount) {

      const token: SessionToken = {
        rights: resultAccount.rights,
        expirationTime: this.generateExpirationTime(),
        username: resultAccount.username,
        valid: true,
        tokenId: this.generateRandomTokenId()
      }

      await this.sessionTokenDBAccess.storeSessionToken(token)
      return token
    } else {
      return undefined
    }
  }

  public async validateToken(tokenId: string): Promise<TokenRights> {
    const token = await this.sessionTokenDBAccess.getSessionToken(tokenId)
    if(!token || !token.valid) {
      return {
        rights: [],
        state: TokenState.INVALID
      }
    } else if(token.expirationTime < new Date()) {
      return {
        rights: [],
        state: TokenState.EXPIRED
      }
    } return {
        rights: token.rights,
        state: TokenState.VALID
    }
  }

  private generateExpirationTime() {
    return new Date(Date.now() + 60 * 60 * 1000)
  }

  private generateRandomTokenId() {
    return Math.random().toString(36).slice(2)
  }

}
