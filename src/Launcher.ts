import { Server } from './Server/Server'

class Laucher {
  private server: Server

  constructor() {
    this.server = new Server()
  }

  public lauchApp() {
    this.server.createServer()
  }
}

new Laucher().lauchApp()
