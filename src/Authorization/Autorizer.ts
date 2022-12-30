import { Account, SessionToken, TokenGenerator } from "../Server/Model";
import { CredentialDBAccess } from "./CredentialsDBAccess";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";

export class Authorizer implements TokenGenerator {

  private credentialDBAccess: CredentialDBAccess = new CredentialDBAccess()
  private sessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess()

  public async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.credentialDBAccess.getCredential(
      account.username, account.password
    )

    if(resultAccount) {
      const token: SessionToken = {
        rignts: resultAccount.rights,
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

  private generateExpirationTime() {
    return new Date(Date.now() + 60 * 60 * 1000)
  }

  private generateRandomTokenId() {
    return Math.random().toString(36).slice(2)
  }

}
