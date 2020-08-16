import Router from 'koa-router';
import { QuestionModel } from '$components/question';

const questionRouter = new Router();

questionRouter.get('/questions', async (ctx, next) => {
  ctx.body = await QuestionModel.find({}, {
    correct: 0,
    _id: 0,
    __v: 0,
  });
  return next();
});

export default questionRouter;
