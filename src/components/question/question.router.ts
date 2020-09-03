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

questionRouter.post('/answers', async (ctx, next) => {
  const { answers } = ctx.request.body;

  let questions;
  try {
    questions = await QuestionModel.find({}, {
      id: 1,
      correct: 1
    });
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
    return next()
  }
  const correctAnswers = questions.reduce((acc, question) => ({
      ...acc,
      [String(question.id)]: question.correct
    }), {});
  const result = Object.keys(answers).reduce((acc, answerKey) => {
    if (correctAnswers[answerKey] === answers[answerKey]) {
      return acc + 1;
    }

    return acc;
  }, 0);

  ctx.body = {
    result
  };

  return next();
});

export default questionRouter;
