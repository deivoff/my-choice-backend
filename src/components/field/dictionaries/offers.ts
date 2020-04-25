import { FieldType, Offer } from '$components/field';

export default [
  {
    id: 0,
    type: FieldType.offer,
    description: "Предложили помочь организовать благотворительную акцию «Помоги бездомным» Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласились, но ничего не сделали",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 1,
    type: FieldType.offer,
    description: "Предложили поучаствовать в митинге «Я против всех» Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          dark: 1,
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          dark: 1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 2,
    type: FieldType.offer,
    description: "Незнакомец попросил передать сверток в другой город. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          lives: -1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 3,
    type: FieldType.offer,
    description: "Вас попросили поучаствовать в благотворительности - почитать слепым. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 4,
    type: FieldType.offer,
    description: "Вам предложили стать волонтером на международном Фестивале. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете на мероприятие",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 5,
    type: FieldType.offer,
    description: "Попросили сыграть в спектакле для детского дома. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете",
        resources: {
          dark: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 6,
    type: FieldType.offer,
    description: "У Вас есть супер идея проекта. Пойдете ли подавать на грантовый конкурс?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 1,
          money: 10,
        }
      },
      {
        id: 1,
        text: "Нет",
        resources: {}
      }
    ]
  },
  {
    id: 7,
    type: FieldType.offer,
    description: "Бездомный на улице подошел и попросился переночевать у Вас. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Согласитесь, но потребуете что-то взамен",
        resources: {
          lives: -1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Молча проигнорируете",
        resources: {
        }
      },
      {
        id: 3,
        text: "Откажете в грубой форме",
        resources: {
          white: -1,
        }
      }
    ]
  },
  {
    id: 8,
    type: FieldType.offer,
    description: "В магазине Вам дали сдачу больше, чем должны были. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Взяли и молча ушли",
        resources: {
          money: 10,
        }
      },
      {
        id: 1,
        text: "Сообщили об ошибке и вернули деньги",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 9,
    type: FieldType.offer,
    description: "Незнакомец попросил покараулить дорогие вещи. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          lives: -1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь и украдете",
        resources: {
          dark: 1,
          money: 50,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {
          lives: 1,
        }
      }
    ]
  },
  {
    id: 10,
    type: FieldType.offer,
    description: "Вам предложили покурить «травку». Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          dark: 1,
          money: -10,
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Откажетесь и уйдете",
        resources: {
        }
      },
      {
        id: 2,
        text: "Откажетесь, но продолжите общаться",
        resources: {
          lives: -1,
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 11,
    type: FieldType.offer,
    description: "Вам предложили «постоять на шухере» во время кражи. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          dark: 1,
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          dark: 1,
          money: 10,
          lives: -1,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {}
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 12,
    type: FieldType.offer,
    description: "Вас попросили побыть сиделкой. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 13,
    type: FieldType.offer,
    description: "Вас попросили почистить питомник для животных. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 14,
    type: FieldType.offer,
    description: "Вам предложили съесть собаку по-фану. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          dark: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
          dark: 1,
        }
      },
      {
        id: 2,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {}
      }
    ]
  },
  {
    id: 15,
    type: FieldType.offer,
    description: "Добровольцы попросили денег на благотворительный проект. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 3,
          money: -10,
        }
      },
      {
        id: 1,
        text: "Откажете",
        resources: {
          white: -1,
        }
      },
      {
        id: 2,
        text: "Откажете и отберете деньги",
        resources: {
          money: 10,
          dark: 1,
        }
      },
      {
        id: 3,
        text: "Молча проигнорируете",
        resources: {}
      }
    ]
  },
  {
    id: 16,
    type: FieldType.offer,
    description: "Вам предложили сбежать из дома «в общину». Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          lives:-1,
          dark: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь по-фану на недельку",
        resources: {
          lives:-1,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 17,
    type: FieldType.offer,
    description: "Вас позвали играть в карты на деньги. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          lives:-1,
          dark: 1,
          money: 10,
        }
      },
      {
        id: 1,
        text: "Согласитесь, но будете просто наблюдать",
        resources: {
          dark: 1,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 18,
    type: FieldType.offer,
    description: "Предложили помочь организовать благотворительную акцию «Защити бездомных животных». Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Согласились, но ничего не сделали",
        resources: {
          white: -1,
        }
      }
    ]
  },
  {
    id: 19,
    type: FieldType.offer,
    description: "Предложили организовать митинг «Моя страна – мои правила. Мы здесь власть!». Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: -1,
          dark: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          white: -1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 20,
    type: FieldType.offer,
    description: "В аэропорту незнакомец попросил передать посылку в другой город. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          lives: -1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 21,
    type: FieldType.offer,
    description: "Вас попросили поучаствовать в благотворительности, сыграть в немом спектакле для глухих. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {
        }
      }
    ]
  },
  {
    id: 22,
    type: FieldType.offer,
    description: "Вам предложили стать волонтером на международной научной конференции. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {
        }
      }
    ]
  },
  {
    id: 23,
    type: FieldType.offer,
    description: "Попросили провести игротеку в детском доме. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Согласитесь, но не придете",
        resources: {
          dark: 1,
        }
      },
      {
        id: 3,
        text: "Откажетесь",
        resources: {
        }
      }
    ]
  },
  {
    id: 24,
    type: FieldType.offer,
    description: "У Вашего друга есть супер идея проекта. Поможете ли ему реализовать ее?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 1,
          lives: -1,
          money: 10,
        }
      },
      {
        id: 1,
        text: "Нет",
        resources: {
        }
      }
    ]
  },
  {
    id: 25,
    type: FieldType.offer,
    description: "Бездомный на улице подошел и попросил поесть. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Согласитесь, но потребуете что-то взамен",
        resources: {
          money: 10,
          lives: -1,
        }
      },
      {
        id: 2,
        text: "Откажете в грубой форме",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Молча проигнорируете",
        resources: {
        }
      }
    ]
  },
  {
    id: 26,
    type: FieldType.offer,
    description: "В магазине Вам не пробили дорогостоящий товар (выдали, но по ошибке не пробили). Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Взяли и молча ушли",
        resources: {
          money: 10,
        }
      },
      {
        id: 1,
        text: "Сообщили об ошибке и попросили пробить",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 27,
    type: FieldType.offer,
    description: "Вам предложили попробовать наркотики. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          lives:-1,
          dark: 1,
          money: -10,
        }
      },
      {
        id: 1,
        text: "Откажетесь и уйдете",
        resources: {

        }
      },
      {
        id: 2,
        text: "Откажетесь, но продолжите общаться",
        resources: {
          lives:-1,
          white: -1,
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 28,
    type: FieldType.offer,
    description: "Вам предложили поучаствовать в групповой краже. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          lives:-1,
          dark: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          lives: -1,
          dark: 1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 29,
    type: FieldType.offer,
    description: "Вас попросили поухаживать за тяжелобольным на неделю. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Согласитесь, но не придете",
        resources: {
          white: -1,
        }
      }
    ]
  },
  {
    id: 30,
    type: FieldType.offer,
    description: "Вас попросили поучаствовать в городском благотворительном субботнике. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Согласитесь, но не придете",
        resources: {
          white: -1,
        }
      }
    ]
  },
  {
    id: 31,
    type: FieldType.offer,
    description: "Добровольцы попросили старые вещи для благотворительного проекта. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          white: 3,
          money: -10,
        }
      },
      {
        id: 1,
        text: "Согласитесь только за деньги",
        resources: {
          money: 10,
          dark: 1,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
          white: -1,
        }
      },
    ]
  },
  {
    id: 32,
    type: FieldType.offer,
    description: "Вас позвали участвовать в «бойцовском клубе» драться на деньги. Ваша реакция:",
    choices: [
      {
        id: 0,
        text: "Согласитесь",
        resources: {
          lives: -1,
          dark: 1,
          money: 10,
        }
      },
      {
        id: 1,
        text: "Согласитесь, но будете просто наблюдать",
        resources: {
          dark: 1,
        }
      },
      {
        id: 2,
        text: "Откажетесь",
        resources: {
        }
      },
      {
        id: 3,
        text: "Откажетесь и сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 33,
    type: FieldType.offer,
    description: "К Вам на улице подошёл незрячий человек и попросил подсказать, где находится остановка. Как Вы поступите?",
    choices: [
      {
        id: 0,
        text: "Расскажу, как пройти на остановку ",
        resources: {
          lives: 1,
        }
      },
      {
        id: 1,
        text: "Откажу ему",
        resources: {
          dark: 1,
        }
      },
      {
        id: 2,
        text: "Доведу его до остановки",
        resources: {
          white: 1,
        }
      },
    ]
  },
  {
    id: 34,
    type: FieldType.offer,
    description: "Друзья предложили Вам на спор пнуть бродягу. Как Вы поступите?",
    choices: [
      {
        id: 0,
        text: "Объясню друзьям, что так поступать нехорошо",
        resources: {
          lives: -1,
          white: 1,
        }
      },
      {
        id: 1,
        text: "Соглашусь",
        resources: {
          dark: 1,
          lives: -1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Откажусь",
        resources: {
          white: 1,
        }
      },
    ]
  },
  {
    id: 35,
    type: FieldType.offer,
    description: "Близкий человек попросил у Вас денег в долг. Он уже брал в долг у Вас крупную сумму и ещё не вернул. Как Вы поступите?",
    choices: [
      {
        id: 0,
        text: "Дам ему взаймы",
        resources: {
          lives: -1,
          money: -10,
        }
      },
      {
        id: 1,
        text: "Откажу ему",
        resources: {
          white: -1,
          lives: +1,
          money: -10,
        }
      },
      {
        id: 2,
        text: "Скажу,  что готов помочь, но не дам денег",
        resources: {
          dark: 1,
        }
      },
    ]
  },
] as Offer[];
