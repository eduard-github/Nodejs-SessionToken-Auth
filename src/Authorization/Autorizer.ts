import { Account, SessionToken, TokenGenerator } from "../Server/Model";
import { CredentialDBAccess } from "./CredentialsDBAccess";

export class Authorizer implements TokenGenerator {

  private credDBAccess: CredentialDBAccess = new CredentialDBAccess()

  public async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.credDBAccess.getCredential(
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


      return {
        tokenId: 'someTokenId'
      } as any
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
