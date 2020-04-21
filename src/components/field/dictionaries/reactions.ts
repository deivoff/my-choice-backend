import { FieldType, Reaction } from '$components/field';

export default [
  {
    id: 0,
    type: FieldType.reaction,
    description: "Ваш(а) парень (девушка) не пришел(ла) на свидание.",
    choices: [
      {
        id: 0,
        text: "Расстроюсь и поругаюсь с ним/с ней",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Проигнорирую ситуацию и пойду гулять с кем-нибудь другим",
        resources: {}
      },
      {
        id: 2,
        text: "Постараюсь выяснить причину ситуации",
        resources: {}
      },
    ]
  },
  {
    id: 1,
    type: FieldType.reaction,
    description: "В гостях Вы нечаянно разбили вазу.",
    choices: [
      {
        id: 0,
        text: "Буду спорить с хозяевами и обвинять, что они ее неправильно поставили",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Сделаю вид, что ничего не произошло",
        resources: {}
      },
      {
        id: 2,
        text: "Извинюсь и постараюсь возместить ущерб",
        resources: {}
      },
    ]
  },
  {
    id: 2,
    type: FieldType.reaction,
    description: "Отчислили из школы/ВУЗа/уволили с работы.",
    choices: [
      {
        id: 0,
        text: "Уйду в депрессию и буду всех обвинять",
        resources: {
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Постараюсь заново поступить или устроиться",
        resources: {}
      },
      {
        id: 2,
        text: "Оставлю все как есть – само разрешится",
        resources: {}
      },
    ]
  },
  {
    id: 3,
    type: FieldType.reaction,
    description: "В гардеробе кому-то отдали Вашу куртку.",
    choices: [
      {
        id: 0,
        text: "Устрою скандал.",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Выясню ситуацию и постараюсь помочь персоналу найти куртку",
        resources: {}
      },
      {
        id: 2,
        text: "Напишу заявление в полицию",
        resources: {}
      },
    ]
  },
  {
    id: 4,
    type: FieldType.reaction,
    description: "Вас обрызгала машина.",
    choices: [
      {
        id: 0,
        text: "Целый день буду ходить мрачнее тучи и срываться на всех",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Отряхнусь и забуду об этом недоразумении",
        resources: {}
      },
      {
        id: 2,
        text: "Обращусь в администрацию, чтобы ликвидировали лужу",
        resources: {}
      },
    ]
  },
  {
    id: 5,
    type: FieldType.reaction,
    description: "Вас нечаянно, но сильно толкнули.",
    choices: [
      {
        id: 0,
        text: "Толкну в ответ, устрою «разборку»",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Вежливо попрошу извинений",
        resources: {}
      },
      {
        id: 2,
        text: "Промолчу",
        resources: {}
      },
    ]
  },
  {
    id: 6,
    type: FieldType.reaction,
    description: "Вы разбили телефон.",
    choices: [
      {
        id: 0,
        text: "Целый день буду ходить мрачнее тучи и срываться на всех",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Постараюсь починить телефон, буду спокойно решать проблему",
        resources: {}
      },
      {
        id: 2,
        text: "Оставлю все как есть – и без телефона хорошо",
        resources: {}
      },
    ]
  },
  {
    id: 7,
    type: FieldType.reaction,
    description: "Вам недодали сдачу в магазине.",
    choices: [
      {
        id: 0,
        text: "Молча уйду",
        resources: {
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Устрою большой скандал",
        resources: {
          white: -1,
        }
      },
      {
        id: 2,
        text: "Напишу заявление в Роспотребнадзор",
        resources: {}
      },
    ]
  },
  {
    id: 8,
    type: FieldType.reaction,
    description: "Кот сходил в туалет в Ваши ботинки.",
    choices: [
      {
        id: 0,
        text: "Это было последнее, что сделал кот в своей жизни",
        resources: {
          dark: 1,
        }
      },
      {
        id: 1,
        text: "Уберу и буду спокоен",
        resources: {}
      },
      {
        id: 2,
        text: "Целый день буду ходить мрачнее тучи и срываться на всех",
        resources: {
          white: -1
        }
      },
    ]
  },
  {
    id: 9,
    type: FieldType.reaction,
    description: "Ваши друзья уехали тусить, а Вас не позвали.",
    choices: [
      {
        id: 0,
        text: "Больше никогда не буду с ними общаться",
        resources: {
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Узнаю в чем дело и объясню, что они задели меня",
        resources: {}
      },
      {
        id: 2,
        text: "Промолчу",
        resources: {}
      },
    ]
  },
  {
    id: 10,
    type: FieldType.reaction,
    description: "Вы приехали на другой конец города в магазин, а он закрыт.",
    choices: [
      {
        id: 0,
        text: "Целый день буду ходить мрачнее тучи и срываться на всех",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Приеду в этот магазин в следующий раз, предварительно позвонив",
        resources: {}
      },
      {
        id: 2,
        text: "Не нужен мне этот товар – больше не буду ездить",
        resources: {}
      },
    ]
  },
  {
    id: 11,
    type: FieldType.reaction,
    description: "Кондуктор в автобусе прошел мимо Вас, не взяв деньги за проезд.",
    choices: [
      {
        id: 0,
        text: "Сделаю вид, что все «так и надо»",
        resources: {
          white: -1,
        }
      },
      {
        id: 1,
        text: "Остановлю кондуктора и заплачу",
        resources: {}
      },
    ]
  },
  {
    id: 12,
    type: FieldType.reaction,
    description: "Вы поймали «за руку» карманника, который хотел у вас украсть кошелек/телефон.",
    choices: [
      {
        id: 0,
        text: "Вызову полицию",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Сам «разберусь» и проучу",
        resources: {
          dark: 1
        }
      },
      {
        id: 2,
        text: "Испугаюсь и сам убегу",
        resources: {}
      },
    ]
  },
  {
    id: 13,
    type: FieldType.reaction,
    description: "В магазине вам продали просроченный товар.",
    choices: [
      {
        id: 0,
        text: "Молча уйду",
        resources: {}
      },
      {
        id: 1,
        text: "Устрою большой скандал",
        resources: {
          white: -1
        }
      },
      {
        id: 2,
        text: "Напишу заявление в Роспотребнадзор",
        resources: {}
      },
    ]
  },
  {
    id: 14,
    type: FieldType.reaction,
    description: "Ваш лучший друг не поздравил Вас с Днем рождения.",
    choices: [
      {
        id: 0,
        text: "Больше никогда не буду с ними общаться",
        resources: {
          white: -1
        }
      },
      {
        id: 1,
        text: "Узнаю в чем дело и объясню, что они задели меня",
        resources: {}
      },
      {
        id: 2,
        text: "Промолчу",
        resources: {}
      },
    ]
  },
  {
    id: 15,
    type: FieldType.reaction,
    description: "Вы почти закончили собирать паззл на 3000 деталей и его разобрали у вас на глазах.",
    choices: [
      {
        id: 0,
        text: "Ну окей",
        resources: {}
      },
      {
        id: 1,
        text: "Негативная реакция",
        resources: {
          dark: 1
        }
      },
    ]
  },
  {
    id: 16,
    type: FieldType.reaction,
    description: "Вас бросил(а) парень (девушка).",
    choices: [
      {
        id: 0,
        text: "Целый день буду ходить мрачнее тучи и срываться на все",
        resources: {
          lives: 1
        }
      },
      {
        id: 1,
        text: "Забуду об этом недоразумении",
        resources: {}
      },
      {
        id: 2,
        text: "Начну заново",
        resources: {}
      },
    ]
  },
] as Reaction[];
