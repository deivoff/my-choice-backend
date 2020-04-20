import { FieldType, Incident, Offer, Opportunity, Reaction, Situation } from '$components/field/field.helpers';

const SITUATIONS: Situation[] = [
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
];

const OFFERS: Offer[] = [
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
];

const INCIDENTS: Incident[] = [
  {
    id: 0,
    type: FieldType.incident,
    description: "Наградили орденом. Если у вас 10 СК(Б), перейдите на клетку «Возможность»",
    action: {
      more: {
        white: 10,
      },
      result: {
        move: FieldType.opportunity
      }
    }
  },
  {
    id: 1,
    type: FieldType.incident,
    description: "Арестовали. Если у Вас 3 СК(Ч) или более, вы проиграли",
    action: {
      more: {
        dark: 3,
      },
      result: {
        gameover: true,
      }
    }
  }
];

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 0,
    type: FieldType.opportunity,
    description: "Если количество ресурсов позволяет перейти на «внешний круг» (10Ж и СК 10(Б) или 15Ж и 100$) – то вы переходите."
  }
];

const REACTIONS: Reaction[] = [
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
];

export const FIELDS = {
  [FieldType.offer]: OFFERS,
  [FieldType.incident]: INCIDENTS,
  [FieldType.opportunity]: OPPORTUNITIES,
  [FieldType.situation]: SITUATIONS,
  [FieldType.reaction]: REACTIONS,
};
