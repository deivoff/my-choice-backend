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
  static async start() {
    const server = await MockServer.start();
    new Game(server);
  }
}

export default App;

class MockServer {
  static async start() {
    const {
      'NODE_ENV': env,
      'DB_NAME': dbName,
      'DB_URL': dbUrl,
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
      await mongoose.connect(`${dbUrl}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName,
      });
      env === ('development' || 'test') && mongoose.set('debug', true);
      console.log('MongoDB Connected');
    } catch (error) {
      console.error(error);
    }

    const server = http.createServer(app.callback());
    server.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });

    return server;
  }
}
