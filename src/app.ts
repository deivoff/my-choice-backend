import http, { Server } from 'http';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import cors from '@koa/cors';
import { Game } from './game';
import bodyParser from 'koa-bodyparser';

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

    app.use(
      cors({
        origin: '*',
        credentials: true,
      }),
    );
    app.use(bodyParser());
    app.use(async (ctx, next) => {
      ctx.set(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, X-Requested-With, x-access-token',
      );
      ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

      if (ctx.method === 'OPTIONS') {
        return (ctx.status = 200);
      }

      await next();
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    this.server = http.createServer(app.callback());
    this.server.listen(7000, () => {
      console.log('Сервер запущен на порту 8080');
    });
  }
}
