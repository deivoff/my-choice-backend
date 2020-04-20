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
