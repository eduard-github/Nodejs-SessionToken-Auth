import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { UserDBAccess } from "../User/UsersDBAccess";
import { BaseRequestHandler } from "./BasedRequestHandler";
import { TokenValidator } from "./Model";
import { Utils } from "./Utils";


export class UsersHandler extends BaseRequestHandler {

  private userDBAccess: UserDBAccess = new UserDBAccess()
  private tokenValidator: TokenValidator

  constructor(req: IncomingMessage, res: ServerResponse, tokenValidator: TokenValidator) {
    super(req, res)
    this.tokenValidator = tokenValidator
  }

  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handleGet()        
        break;
      default:
        await this.handleNotFound()
        break;
    }
  }

  private async handleGet(): Promise<void> {
    const operationAuthorized = await this.operationAuthorized(AccessRight.READ)
    if(operationAuthorized) {
      const parsedUrl = Utils.getUrlParams(this.req.url)
      if(parsedUrl) {
        const userId = parsedUrl?.query.id
        if(userId) {
          const user = await this.userDBAccess.getUserById(userId as string)  
          if(user) {
            this.respondJsonObject(HTTP_CODES.OK, user)
          } else {
            this.handleNotFound()
          }
        } else {
          this.respondBadRequest('user id is not present')
        }
      }
    } else {
      this.respondUnauthorized('missing or invalid authentication')
    }
  }

  private async operationAuthorized(operation: AccessRight): Promise<boolean> {
    const tokenId = this.req.headers.authorization
    if(tokenId) {
      const tokenRights = await this.tokenValidator.validateToken(tokenId)
      if(tokenRights.rights.includes(operation)) {
        return true
      } else {
        return false
      }
    } else {
      return false 
    }
  }

}
