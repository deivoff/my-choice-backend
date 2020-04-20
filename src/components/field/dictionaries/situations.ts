import { FieldType, Situation } from '$components/field';

export default [
  {
    id: 0,
    type: FieldType.situation,
    description: "Проходя по улице, вы увидели, что на тротуаре лежит мужчина в испачканной одежде. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Подойдете и попытаетесь узнать, что произошло",
        resources: {
          white: 1,
        }
      },
      {
        id: 1,
        text: "Проверите его карманы на наличие ценных вещей",
        resources: {
          dark: 1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Пройдете мимо",
        resources: {
          white: -1,
        }
      },
      {
        id: 3,
        text: "Вызовете «Скорую помощь»",
        resources: {
          lives: 1,
          white: 1,
        }
      }
    ]
  },
  {
    id: 1,
    type: FieldType.situation,
    description: "Вы узнали, что ваш приятель задумал суицид. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Расскажете его родителям, психологу",
        resources: {
          white: 1,
          lives: 1,
        }
      },
      {
        id: 1,
        text: "Начнете его переубеждать и контролировать",
        resources: {
          white: 1,
        }
      },
      {
        id: 2,
        text: "Сделаете вид, что все хорошо и проигнорируете",
        resources: {
          dark: 1,
        }
      },
      {
        id: 3,
        text: "Начнете его высмеивать и выложите в интернет",
        resources: {
          money: 10,
          dark: 1,
        }
      }
    ]
  },
  {
    id: 2,
    type: FieldType.situation,
    description: "Вы узнали, что Деда Мороза не существует. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Примете факт спокойно",
        resources: {
          lives: 1,
          white: 1,
        }
      },
      {
        id: 1,
        text: "Позвоните в полицию",
        resources: {
          dark: 1,
          lives:-1,
        }
      },
      {
        id: 2,
        text: "Расскажете всем друзьям",
        resources: {
          dark: 1,
        }
      },
      {
        id: 3,
        text: "Уйдете в депрессию",
        resources: {
          lives: -3,
          dark: 1,
        }
      }
    ]
  },
  {
    id: 3,
    type: FieldType.situation,
    description: "Вы стали невольным свидетелем укладки «закладки». Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Заберете в свое пользование",
        resources: {
          lives: -1,
          dark: 1,
        }
      },
      {
        id: 1,
        text: "Заберете и продадите",
        resources: {
          dark: 1,
          money: 10,
        }
      },
      {
        id: 2,
        text: "Сообщите в полицию",
        resources: {
          white: 1,
        }
      },
      {
        id: 3,
        text: "Сделаете вид, что не поняли, что произошло",
        resources: {
          white: -1,
        }
      }
    ]
  },
  {
    id: 4,
    type: FieldType.situation,
    description: "Людное помещение, в котором Вы находитесь, начало гореть. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Побежите к выходу",
        resources: {
          lives: 1,
        }
      },
      {
        id: 1,
        text: "Включите пожарную сигнализацию, позвоните в МЧС, начнете эвакуацию людей",
        resources: {
          white: 1,
        }
      },
      {
        id: 2,
        text: "Начнете снимать на телефон",
        resources: {
          money: 10,
        }
      },
      {
        id: 3,
        text: "Будете препятствовать эвакуации",
        resources: {
          lives: -1,
          dark: 1,
        }
      }
    ]
  },
  {
    id: 5,
    type: FieldType.situation,
    description: "К Вам на улице подошли взрослые парни и «невежливо» попросили деньги. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Постараетесь договориться, чтобы они ушли",
        resources: {
          lives: -1,
        }
      },
      {
        id: 1,
        text: "Привлечете внимание прохожих, позовете полицию",
        resources: {
        }
      },
      {
        id: 2,
        text: "Начнете «искать» общих друзей",
        resources: {
          money: 5,
          dark: 1,
        }
      },
      {
        id: 3,
        text: "Отдадите деньги",
        resources: {
          money: -10,
        }
      }
    ]
  },
  {
    id: 6,
    type: FieldType.situation,
    description: "Вы увидели объявление на подъезде о наборе в секту. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Проигнорируете",
        resources: {
        }
      },
      {
        id: 1,
        text: "Позвоните и придете",
        resources: {
          dark: 1,
        }
      },
      {
        id: 2,
        text: "Сообщите в полицию",
        resources: {
          white: 1,
        }
      },
      {
        id: 3,
        text: "Сорвете объявление",
        resources: {
          lives: 1,
        }
      }
    ]
  },
  {
    id: 7,
    type: FieldType.situation,
    description: "Вашего друга начали «травить» (буллинг). Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Присоединитесь к большинству",
        resources: {
          dark: 1,
        }
      },
      {
        id: 1,
        text: "Начнете защищать друга",
        resources: {
          lives: -1,
          white: 1,
        }
      },
      {
        id: 2,
        text: "Будете игнорировать",
        resources: {
        }
      },
      {
        id: 3,
        text: "Сообщите в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 8,
    type: FieldType.situation,
    description: "Вы шли по улице и увидели бездомного котенка. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Заберете домой или отдадите в приют",
        resources: {
          lives: 1,
          white: 1,
        }
      },
      {
        id: 1,
        text: "Пройдете мимо",
        resources: {
        }
      },
      {
        id: 2,
        text: "Испугаете его, чтобы убежал",
        resources: {
          dark: 1,
        }
      },
      {
        id: 3,
        text: "Помоете и продадите",
        resources: {
          money: 10
        }
      }
    ]
  },
  {
    id: 9,
    type: FieldType.situation,
    description: "Прогуливаясь, Вы увидели, как несколько парней пристают и что-то требуют от другого, более молодого. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Вступитесь за «жертву»",
        resources: {
          lives: -1,
          white: 1,
        }
      },
      {
        id: 1,
        text: "Пройдете мимо",
        resources: {
        }
      },
      {
        id: 2,
        text: "Начнете помогать «плохим» парням",
        resources: {
          dark: 1,
          lives: -1,
        }
      },
      {
        id: 3,
        text: "Снимете на телефон",
        resources: {
          money: 10
        }
      }
    ]
  },
  {
    id: 10,
    type: FieldType.situation,
    description: "Ваши друзья предложили вам заняться «шоп-лифтингом». Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Охотно согласитесь",
        resources: {
          dark: 1,
          money: 10,
        }
      },
      {
        id: 1,
        text: "Откажетесь и уйдете домой",
        resources: {
        }
      },
      {
        id: 2,
        text: "Начнете уговаривать их не делать этого",
        resources: {
          white: 1,
        }
      },
      {
        id: 3,
        text: "Позвоните в полицию",
        resources: {
          lives: -1,
          white: 1,
        }
      }
    ]
  },
  {
    id: 11,
    type: FieldType.situation,
    description: "Подходя к светофору, вы увидели бабушку, которая очень медленно ходит и плохо видит. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Снимете на телефон, как она «смешно мучается»",
        resources: {
          dark: 1,
          money: 10,
        }
      },
      {
        id: 1,
        text: "Поможете ей перейти дорогу",
        resources: {
          lives: 1,
          white: 1,
        }
      },
      {
        id: 2,
        text: "Пройдете мимо",
        resources: {
        }
      },
      {
        id: 3,
        text: "Оттолкнете, чтобы не мешалась",
        resources: {
          lives: -1,
          dark: 1,
        }
      }
    ]
  },
  {
    id: 12,
    type: FieldType.situation,
    description: "Вы нашли на улице кошелек с номером телефона владельца. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Заберете себе",
        resources: {
          money: 50,
        }
      },
      {
        id: 1,
        text: "Оставите где нашли",
        resources: {
          lives: 1,
        }
      },
      {
        id: 2,
        text: "Позвоните и вернете",
        resources: {
          lives: -1,
          white: 1,
        }
      },
      {
        id: 3,
        text: "Отнесете в полицию",
        resources: {
          white: 1,
        }
      }
    ]
  },
  {
    id: 13,
    type: FieldType.situation,
    description: "В общественном транспорте Вы обнаружили подозрительную коробку с надписью «Бум!». Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Откроете коробку",
        resources: {
          lives: -5,
        }
      },
      {
        id: 1,
        text: "Проигнорируете и выйдете на следующей остановке",
        resources: {
          lives: 1,
        }
      },
      {
        id: 2,
        text: "Проинформируете водителя",
        resources: {
          white: 1,
        }
      },
      {
        id: 3,
        text: "Крикнете, чтобы все узнали",
        resources: {
          lives: -1,
          white: 1,
        }
      }
    ]
  },
  {
    id: 14,
    type: FieldType.situation,
    description: "Вы стали свидетелем аварии фуры с апельсинами. Ваши действия:",
    choices: [
      {
        id: 0,
        text: "Начнете собирать себе апельсины",
        resources: {
          dark: 1,
          money: 10,
        }
      },
      {
        id: 1,
        text: "Побежите спасать водителя",
        resources: {
          white: 1,
        }
      },
      {
        id: 2,
        text: "Убежите прочь",
        resources: {
          lives: 1,
        }
      },
      {
        id: 3,
        text: "Позвоните друзьям, чтобы немедленно бежали и помогали собирать себе апельсины",
        resources: {
          dark: 1,
          white: 1,
          money: 50,
        }
      }
    ]
  },
] as Situation[];
