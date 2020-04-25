import http, { Server } from 'http';
import mongoose from 'mongoose';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import cors from '@koa/cors';
import { Game } from './game';
import bodyParser from 'koa-bodyparser';
import path from "path";

process.env.NODE_ENV === 'development' && require('dotenv').config({ path: path.join(`${__dirname}./../.env`) });

class App {
  constructor() {
    new Game(new MockServer().server);
  }
}

export default App;

class MockServer {
  public server: Server;
  constructor() {
    const {
      'NODE_ENV': env,
      'DB_NAME': dbName,
      'DB_URL': dbUrl,
      'DB_PASS': pass,
      'DB_USER': user,
    } = process.env;
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

    const PORT = 7000;

    try {
      mongoose.connect(`${dbUrl}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName,
        user,
        pass,
      });
      env === ('development' || 'test') && mongoose.set('debug', true);
      console.log('MongoDB Connected');
    } catch (error) {
      console.error(error);
    }
    this.server = http.createServer(app.callback());
    this.server.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  }
}
