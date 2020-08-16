import Router from 'koa-router';
import data from './data/data.json';
import { QuestionModel } from '$components/question';

const questionRouter = new Router();

questionRouter.get('/questions', async (ctx, next) => {
  // QuestionModel.insertMany(data);
  ctx.body = await QuestionModel.find({}, {
    correct: 0,
    _id: 0,
    __v: 0,
  });
  return next();
});

export default questionRouter;
