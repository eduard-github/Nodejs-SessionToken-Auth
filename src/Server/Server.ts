import { createServer, IncomingMessage, ServerResponse } from 'http'
import { Authorizer } from '../Authorization/Autorizer';
import { LoginHandler } from './LoginHandler';
import { UsersHandler } from './UsersHandler';
import { Utils } from './Utils';

const hostname = '127.0.0.1';
const port = 8080

export class Server {
  private authorizer: Authorizer = new Authorizer()

  public createServer(): void {
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const basePath = Utils.getUrlBasePath(req.url)

      switch (basePath) {
        case 'login':
          await new LoginHandler(req, res, this.authorizer).handleRequest()
          break;
        case 'users':
          await new UsersHandler(req, res, this.authorizer).handleRequest()
          break;
        default:
          break;
      }
      res.end()
    }).listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`))
  }
}
