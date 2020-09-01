import Router from 'koa-router';
import { createCertificate } from './certificate.utils';
import { UserTestModel } from '$components/user/user-test.entity';
// import { UserFalseModel } from '$components/user/user-false.entity';
// import * as fs from 'fs';
// import path from 'path';

const certificateRouter = new Router();

// console.log(path.join(__dirname, '..', 'certs'));
// certificateRouter.get('/certs', async () => {
//   const users = await UserTestModel.find({
//     result: {
//       $exists: true
//     }
//   });
//
//   users.forEach((user, i) => {
//     setTimeout(async () => {
//       console.log('start');
//       const cert = await createCertificate(user.firstName, user.lastName, user.result);
//       const name = `${path.join(__dirname, '..', 'certs_norm')}/${user.firstName}_${user.lastName}_${i}.pdf`;
//       console.log('crated');
//       fs.writeFileSync(name, cert, 'binary');
//       console.log(name);
//       return;
//     }, 10 * i)
//   });
// });

certificateRouter.get('/certificate', async (ctx, next) => {
  const { id } = ctx.request.query;

  if (!id) {
    ctx.status = 400;
    ctx.body = '<h1>Нет пользователя!</h1>' +
      '<h2>Скорее всего, у вас неправильная ссылка, пройдите на нее через свои результаты теста</h2>';
    return next();
  }

  try {
    const user = await UserTestModel.findOne({ id }, {
      firstName: 1,
      lastName: 1,
      id: 1,
      result: 1,
    });

    if (!user) {
      ctx.status = 404;
      ctx.body = '<h1>Такого пользователя не существует :c</h1>' +
        '<h2>Возможно ошибка у нас, обратитесь в техподдержку: allianssonko@gmail.com</h2>';
      return next();
    }

    if (!user.result) {
      ctx.status = 404;
      ctx.body = '<h1>Вы еще либо не прошли тест или подождите немного и перезагрузите эту страницу</h1> ' +
        '<h2>Возможно ошибка у нас, обратитесь в техподдержку: allianssonko@gmail.com</h2>';
      return next();
    }

    ctx.response.set("content-type", "application/pdf");
    ctx.body = await createCertificate(user.firstName, user.lastName, user.result);
    return next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

export default certificateRouter;
