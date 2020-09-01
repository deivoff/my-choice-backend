import Router from 'koa-router';
import { UserTestModel } from '$components/user/user-test.entity';
import data from './from-file/parse';
import sendMail from '$components/nodemailer';
import { UserFalseModel } from '$components/user/user-false.entity';

const userTestRouter = new Router();

userTestRouter.get('/users', async (ctx, next) => {
  // UserFalseModel.insertMany(data);
  ctx.body = data
  ctx.body = await UserFalseModel.find({
    result: {
      $exists: true
    }
  });
  return next()
});

userTestRouter.get('/user', async (ctx, next) => {
  const { id } = ctx.request.query;

  if (!id) {
    ctx.status = 400;
    ctx.body = 'Bad request';
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
      ctx.body = 'User not found';
      return next();
    }

    ctx.body = user;
    return next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

// userTestRouter.get('/sendmail.json', async (ctx) => {
//   const users = await UserTestModel.find();
//   ctx.body = users;
//   // users.forEach((user, i) => {
//   //   setTimeout(() => sendMail(
//   //     user.email,
//   //     'Второй региональный общественно-политический диктант "Я гражданин"',
//   //     `Здравствуйте, ${user.firstName}!
//   //     \n Вас приветствует команда общественно-политического диктанта "Я гражданин"! Ваш уникальный код (логин) для входа в тестирование: ${user.id}
//   //     \n Для участия в тесте перейдите по ссылке: мойвыбор72.рф/`,
//   //   ), i * 1000);
//   // })
// });

export default userTestRouter;
