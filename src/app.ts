import http, { Server } from 'http';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import { Game } from './game';

class App {
  constructor() {
    new Game(new MockServer().server);
  }
}

export default App;

class MockServer {
  public server: Server;
  constructor() {
    const app = new Koa();
    const router = new KoaRouter();

    app.use(router.routes());
    app.use(router.allowedMethods());

    this.server = http.createServer(app.callback());
    this.server.listen(8080, () => {
      console.log('Сервер запущен на порту 8080');
    });
  }
}
