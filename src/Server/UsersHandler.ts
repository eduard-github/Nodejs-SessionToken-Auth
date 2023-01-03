import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
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
      case HTTP_METHODS.PUT:
        await this.handlePut()
        break;
      case HTTP_METHODS.DELETE:
        await this.handleDelete()
        break;
      default:
        await this.handleNotFound()
        break;
    }
  }

  private async handleDelete(): Promise<void> {
    const operationAuthorized = await this.operationAuthorized(AccessRight.DELETE)
    if (operationAuthorized) {
      const parsedUrl = Utils.getUrlParams(this.req.url)
      if (parsedUrl) {
        const userId = parsedUrl?.query.id
        if (userId) {
          try {
            const deleteResult = await this.userDBAccess.deleteUser(userId as string)
            if (deleteResult) {
              this.respondText(HTTP_CODES.OK, `user ${userId} was deleted`)
            } else {
              this.respondText(HTTP_CODES.OK, `user ${userId} was not deleted`)
            }
          } catch (error) {
            this.handleNotFound()
          }
        } else {
          this.respondBadRequest('user id not present')
        }
      }
    } else {
      this.respondUnauthorized('missing or invalid authentication')
    }
  }

  private async handlePut(): Promise<void> {
    const operationAuthorized = await this.operationAuthorized(AccessRight.CREATE)
    if (operationAuthorized) {
      try {
        const user: User = await this.getRequestBody()
        await this.userDBAccess.putUser(user)
        this.respondText(HTTP_CODES.CREATED, `user ${user.name} created`)
      } catch (error) {
        this.respondBadRequest((error as Error).message)
      }
    } else {
      this.respondUnauthorized('missing or invalid authentication')
    }
  }

  private async handleGet(): Promise<void> {
    const operationAuthorized = await this.operationAuthorized(AccessRight.READ)
    if (operationAuthorized) {
      const parsedUrl = Utils.getUrlParams(this.req.url)
      if (parsedUrl) {
        const userId = parsedUrl?.query.id
        const userName = parsedUrl?.query.name
        if (userId) {
          try {
            const user = await this.userDBAccess.getUserById(userId as string)
            this.respondJsonObject(HTTP_CODES.OK, user)
          } catch (error) {
            this.handleNotFound()
          }
          // if(user) {
          //   this.respondJsonObject(HTTP_CODES.OK, user)
          // } else {
          //   this.handleNotFound()
          // }
        } else if (userName) {
          const users = await this.userDBAccess.getUserByName(userName as string)
          this.respondJsonObject(HTTP_CODES.OK, users)
        } else {
          this.respondBadRequest('user id or name not present')
        }
      }
    } else {
      this.respondUnauthorized('missing or invalid authentication')
    }
  }

  private async operationAuthorized(operation: AccessRight): Promise<boolean> {
    const tokenId = this.req.headers.authorization
    if (tokenId) {
      const tokenRights = await this.tokenValidator.validateToken(tokenId)
      if (tokenRights.rights.includes(operation)) {
        return true
      } else {
        console.log('Forbidden')
        return false
      }
    } else {
      return false
    }
  }

}
