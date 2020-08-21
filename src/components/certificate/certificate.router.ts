import Router from 'koa-router';
import { createCertificate } from './certificate.utils';
import { UserTestModel } from '$components/user/user-test.entity';

const certificateRouter = new Router();

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
