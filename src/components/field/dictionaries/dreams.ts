import { Dream, FieldType } from '$components/field';

export default [
  {
    id: 0,
    type: FieldType.dream,
    description: "Когда в России появилось социальное явление – добровольчество?",
    choices: [
      {
        id: 0,
        text: "Конец 19 века",
        resources: {}
      },
      {
        id: 1,
        text: "50-е годы 20 века",
        resources: {}
      },
      {
        id: 2,
        text: "80-е годы 20 века",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 1,
    type: FieldType.dream,
    description: "Когда в Россию пришло понятие «волонтер»?",
    choices: [
      {
        id: 0,
        text: "1990-е годы",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "2000-е годы",
        resources: {}
      },
      {
        id: 2,
        text: "19 век",
        resources: {}
      }
    ]
  },
  {
    id: 2,
    type: FieldType.dream,
    description: "В каком году в России благотворительность законодательно признана правовым видом деятельности?",
    choices: [
      {
        id: 0,
        text: "1997",
        resources: {}
      },
      {
        id: 1,
        text: "2001",
        resources: {}
      },
      {
        id: 2,
        text: "1995",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 3,
    type: FieldType.dream,
    description: "Что такое НКО?",
    choices: [
      {
        id: 0,
        text: "Неформальные коммерческие организации",
        resources: {}
      },
      {
        id: 1,
        text: "Непонятное какое-то определение",
        resources: {}
      },
      {
        id: 2,
        text: "Некоммерческие организации",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 4,
    type: FieldType.dream,
    description: "Когда празднуют Международный День Добровольцев?",
    choices: [
      {
        id: 0,
        text: "Последнее воскресенье ноября",
        resources: {}
      },
      {
        id: 1,
        text: "5 декабря",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Некоммерческие организации",
        resources: {}
      }
    ]
  },
  {
    id: 5,
    type: FieldType.dream,
    description: "Отметьте страны, в которых не развивается добровольческое движение?",
    choices: [
      {
        id: 0,
        text: "Россия",
        resources: {}
      },
      {
        id: 1,
        text: "США",
        resources: {}
      },
      {
        id: 2,
        text: "Япония",
        resources: {}
      },
      {
        id: 3,
        text: "Италия",
        resources: {}
      },
      {
        id: 4,
        text: "Франция",
        resources: {}
      },
      {
        id: 5,
        text: "Нет таких стран",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 6,
    type: FieldType.dream,
    description: "Добровольцы – это… (продолжите определение)",
    choices: [
      {
        id: 0,
        text: "Граждане с доброй волей",
        resources: {}
      },
      {
        id: 1,
        text:
          "Граждане, осуществляющие благотворительную деятельность в форме безвозмездного труда",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Городские сумасшедшие",
        resources: {}
      },
      {
        id: 3,
        text: "Граждане, добровольно идущие на косметические опыты",
        resources: {}
      }
    ]
  },
  {
    id: 7,
    type: FieldType.dream,
    description: "Получают ли заработную плату участники международных волонтерских лагерей?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 8,
    type: FieldType.dream,
    description: "Можно ли поставить знак равенства между словами волонтер и доброволец?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 9,
    type: FieldType.dream,
    description: "Детское общественное объединение – это…",
    choices: [
      {
        id: 0,
        text: "Объединение детей по интересам",
        resources: {}
      },
      {
        id: 1,
        text: "Студия, кружок, секция в учреждении дополнительного образования",
        resources: {}
      },
      {
        id: 2,
        text:
          "Объединение молодых граждан совместной целью, интересами, увлечению и совместной деятельностью по их продвижению в обществе",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 10,
    type: FieldType.dream,
    description: "В каком случае детское общественное объединение может стать детской общественной организацией?",
    choices: [
      {
        id: 0,
        text: "Ни в каком",
        resources: {}
      },
      {
        id: 1,
        text: "По желанию руководителя",
        resources: {}
      },
      {
        id: 2,
        text: "Регистрация в органах юстиции",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 11,
    type: FieldType.dream,
    description: "Можно ли в 15 лет стать учредителем детской общественной организации?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 12,
    type: FieldType.dream,
    description: "В каком году в России оформилось детское общественное движение – пионеры?",
    choices: [
      {
        id: 0,
        text: "1909",
        resources: {}
      },
      {
        id: 1,
        text: "1922",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "1990",
        resources: {}
      }
    ]
  },
  {
    id: 13,
    type: FieldType.dream,
    description: "Социальный проект – это…",
    choices: [
      {
        id: 0,
        text: "План мероприятий",
        resources: {}
      },
      {
        id: 1,
        text: "Программа действий, направленная на решение социальных проблем",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Выборы в муниципальные органы власти",
        resources: {}
      }
    ]
  },
  {
    id: 14,
    type: FieldType.dream,
    description: "Какие организации относятся к некоммерческим?",
    choices: [
      {
        id: 0,
        text: "Муниципальное лечебное учреждение",
        resources: {}
      },
      {
        id: 1,
        text: "Муниципальное унитарное предприятие",
        resources: {}
      },
      {
        id: 2,
        text: "Пенсионный фонд РФ",
        resources: {}
      },
      {
        id: 3,
        text: "Благотворительный фонд",
        resources: {
          white: 10
        }
      },
      {
        id: 4,
        text: "Малое предприятие",
        resources: {}
      },
      {
        id: 5,
        text: "Адвокатская контора",
        resources: {}
      },
      {
        id: 6,
        text: "Производственный кооператив",
        resources: {}
      },
      {
        id: 7,
        text: "Областной драматический театр",
        resources: {}
      },
      {
        id: 8,
        text: "Учреждение исполнения наказаний",
        resources: {}
      }
    ]
  },
  {
    id: 15,
    type: FieldType.dream,
    description: "Что является особенностью формирования и использования финансов некоммерческой организации?",
    choices: [
      {
        id: 0,
        text: "Использование добровольных взносов и пожертвований как основного источника доходов",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Осуществление предпринимательской деятельности для цели, ради которой она была создана",
        resources: {}
      },
      {
        id: 2,
        text: "Достижение максимальной прибыли за счет производственно-финансовой деятельности",
        resources: {}
      }
    ]
  },
  {
    id: 16,
    type: FieldType.dream,
    description: "Какое из свойств присуще только некоммерческой организации:",
    choices: [
      {
        id: 0,
        text: "Наличие статуса юридического лица",
        resources: {}
      },
      {
        id: 1,
        text: "Целью деятельности является получение прибыли",
        resources: {}
      },
      {
        id: 2,
        text:
          "Предполагаемая к получению прибыль не может быть распеределена между участниками НКО",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 17,
    type: FieldType.dream,
    description: "В отличие от общественных и религиозных организаций фонды:",
    choices: [
      {
        id: 0,
        text:
          "Вправе заниматься предпринимательской деятельностью для достижения целей, ради которых они были созданы",
        resources: {}
      },
      {
        id: 1,
        text:
          "Некоммерческая организация, не имеющая членство, учрежденная гражданами и(или) юридическими лицами",
        resources: {}
      },
      {
        id: 2,
        text: "Преследует исключительно благотворительные цели",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 18,
    type: FieldType.dream,
    description: "Благотворительные программы крупных коммерческих банков и предприятий, реализующие через предприятия третьего сектора экономики, представляют собой - …",
    choices: [
      {
        id: 0,
        text: "Межсекторное социальное парнерство",
        resources: {}
      },
      {
        id: 1,
        text:
          "Социальное партнерство некоммерческих структур и некоммерческих организаций",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Социальный альянс",
        resources: {}
      },
      {
        id: 3,
        text: "Коммерческое партнерство",
        resources: {}
      }
    ]
  },
  {
    id: 19,
    type: FieldType.dream,
    description: "Деятельность по сбору средств, формированию, созданию различных финансовых денежных фондов, в частности, для благотворительных либо образовательных целей – это …",
    choices: [
      {
        id: 0,
        text: "Фандрайзинг",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Управление финансами",
        resources: {}
      },
      {
        id: 2,
        text: "Распределение финансов",
        resources: {}
      },
      {
        id: 3,
        text: "Накопление капитала",
        resources: {}
      }
    ]
  },
  {
    id: 20,
    type: FieldType.dream,
    description: "Добровольная деятельность граждан и юридических лиц по бескорыстной передаче гражданам или юридическим лицам имущества, бескорыстному выполнению работ, предоставлению услуг, оказанию иной поддержки считается деятельностью …",
    choices: [
      {
        id: 0,
        text: "Чрезвычайной",
        resources: {}
      },
      {
        id: 1,
        text: "Операционной",
        resources: {}
      },
      {
        id: 2,
        text: "Благотворительной",
        resources: {
          white: 10
        }
      },
      {
        id: 3,
        text: "Уставной",
        resources: {}
      }
    ]
  },
  {
    id: 21,
    type: FieldType.dream,
    description: "Филантропическая деятельность отечественных и зарубежных предпринимателей с некоммерческими организациями представляет собой …",
    choices: [
      {
        id: 0,
        text: "Межсекторное социальное партнерство",
        resources: {}
      },
      {
        id: 1,
        text:
          "Социальное партнерство коммерческих структур и некоммерческих организаций",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Коммерческое партнерство",
        resources: {}
      },
      {
        id: 3,
        text: "Международное партнерство",
        resources: {}
      }
    ]
  },
  {
    id: 22,
    type: FieldType.dream,
    description: "Достижение социального эффекта являются целью …",
    choices: [
      {
        id: 0,
        text: "Некоммерческой деятельности",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Некоммерческого маркетинга",
        resources: {}
      },
      {
        id: 2,
        text: "Коммерческого маркетинга",
        resources: {}
      },
      {
        id: 3,
        text: "Коммерческой деятельности",
        resources: {}
      }
    ]
  },
  {
    id: 23,
    type: FieldType.dream,
    description: "Максимизация социального эффекта при рациональном использовании необходимых ограниченных ресурсов общества является целью …",
    choices: [
      {
        id: 0,
        text: "Коммерческой деятельности",
        resources: {}
      },
      {
        id: 1,
        text: "Коммерческого маркетинга",
        resources: {}
      },
      {
        id: 2,
        text: "Неоммерческого маркетинга",
        resources: {
          white: 10
        }
      },
      {
        id: 3,
        text: "Неоммерческой деятельности",
        resources: {}
      }
    ]
  },
  {
    id: 24,
    type: FieldType.dream,
    description: "Маркетинг, основанный на гуманизации и гуманитарной направленности, - это маркетинг …",
    choices: [
      {
        id: 0,
        text: "Целевой",
        resources: {}
      },
      {
        id: 1,
        text: "Неоммерческий",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Массовый",
        resources: {}
      },
      {
        id: 3,
        text: "Концентрированный",
        resources: {}
      }
    ]
  },
  {
    id: 25,
    type: FieldType.dream,
    description: "Нечто ценное, что организация планирует обменять на то, что ей необходимо, - это …",
    choices: [
      {
        id: 0,
        text: "Продукт некоммерческой организации",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Материалы",
        resources: {}
      },
      {
        id: 2,
        text: "Сырье",
        resources: {}
      },
      {
        id: 3,
        text: "Товар",
        resources: {}
      }
    ]
  },
  {
    id: 26,
    type: FieldType.dream,
    description: "Образ организации, складывающийся у клиентов, потребителей, партнеров, общественности, - это …",
    choices: [
      {
        id: 0,
        text: "Рейтинг",
        resources: {}
      },
      {
        id: 1,
        text: "Имидж организации",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Goodwill",
        resources: {}
      },
      {
        id: 3,
        text: "Брендинг",
        resources: {}
      }
    ]
  },
  {
    id: 27,
    type: FieldType.dream,
    description: "Цель некоммерческой организации – это …",
    choices: [
      {
        id: 0,
        text: "Корректировка производственной деятельности",
        resources: {}
      },
      {
        id: 1,
        text: "Корректировка закупочной деятельности",
        resources: {}
      },
      {
        id: 2,
        text: "Достижение социального эффекта",
        resources: {
          white: 10
        }
      },
      {
        id: 3,
        text: "Наращивание капитала",
        resources: {}
      }
    ]
  },
  {
    id: 28,
    type: FieldType.dream,
    description: "Добровольные объединения граждан, в установленном законом порядке объединившихся на основе общности их интересов для удовлетворения духовных или иных нематериальных потребностей, - это …",
    choices: [
      {
        id: 0,
        text: "Общественные и религиозные организации (объединения)",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Корпорации",
        resources: {}
      },
      {
        id: 2,
        text: "Автономные некоммерческие организации",
        resources: {}
      },
      {
        id: 3,
        text: "Некоммерческие партнерства",
        resources: {}
      }
    ]
  },
  {
    id: 29,
    type: FieldType.dream,
    description: "К видам стимулирования социальной активности прямым финансированием относятся …",
    choices: [
      {
        id: 0,
        text: "Субсидии",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text:
          "Размещение государственных заказов на выполнение социальных услуг",
        resources: {}
      },
      {
        id: 2,
        text: "Предоставление льгот по налогам",
        resources: {}
      },
      {
        id: 3,
        text: "Предоставление льготных кредитов",
        resources: {}
      }
    ]
  },
  {
    id: 30,
    type: FieldType.dream,
    description: "Не имеющая членства некоммерческая организация, учрежденная Российской Федерацией на основе имущественного взноса и созданная для осуществления социальных, управленческих или иных общественно полезных функций, - это …",
    choices: [
      {
        id: 0,
        text: "Государственная корпорация",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Учреждение",
        resources: {}
      },
      {
        id: 2,
        text: "Фонд",
        resources: {}
      },
      {
        id: 3,
        text: "Автономная некоммерческая организация",
        resources: {}
      }
    ]
  },
  {
    id: 31,
    type: FieldType.dream,
    description: "Некоммерческая организация, созданная собственником для осуществления управленческих, социально-культурных или иных функций некоммерческого характера и финансируемая полностью или частично этим собственником, - это …",
    choices: [
      {
        id: 0,
        text: "Партнерство",
        resources: {}
      },
      {
        id: 1,
        text: "Союз",
        resources: {}
      },
      {
        id: 2,
        text: "Автономная некоммерческая организация",
        resources: {}
      },
      {
        id: 3,
        text: "Учреждение",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 32,
    type: FieldType.dream,
    description: "Общая цель создания некоммерческих организаций заключается в …",
    choices: [
      {
        id: 0,
        text: "Достижении общественных благ",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Распределении прибыли между участниками",
        resources: {}
      },
      {
        id: 2,
        text: "Извлечение прибыли",
        resources: {}
      },
      {
        id: 3,
        text: "Определении приоритетного направления деятельности",
        resources: {}
      }
    ]
  },
  {
    id: 33,
    type: FieldType.dream,
    description: "Объединение, которое осуществляет свою деятельность в соответствии с уставными целями на территории более половины субъектов Российской Федерации, имеет там свои структурные подразделения, - это общественное объединение …",
    choices: [
      {
        id: 0,
        text: "Региональное",
        resources: {}
      },
      {
        id: 1,
        text: "Общероссийское",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Межрегиональное",
        resources: {}
      },
      {
        id: 3,
        text: "Местное",
        resources: {}
      }
    ]
  },
  {
    id: 34,
    type: FieldType.dream,
    description: "Основанное на членстве общественное объединение, созданное на основе совместной деятельности для защиты общих интересов и достижения уставных целей объединившихся граждан, - это общественное(ая) …",
    choices: [
      {
        id: 0,
        text: "Движение",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Учреждение",
        resources: {}
      },
      {
        id: 2,
        text: "Организация",
        resources: {}
      },
      {
        id: 3,
        text: "Объединение",
        resources: {}
      }
    ]
  },
  {
    id: 35,
    type: FieldType.dream,
    description: "Различие некоммерческих и коммерческих организаций выражается в …",
    choices: [
      {
        id: 0,
        text: "Анализе расходов, связанных с привлечением заемных средств",
        resources: {}
      },
      {
        id: 1,
        text:
          "Предоставлении услуг своей клиентской группе бесплатно или по ценам ниже рыночных",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Получении займов",
        resources: {}
      },
      {
        id: 3,
        text: "Операционном окружении",
        resources: {}
      }
    ]
  },
  {
    id: 36,
    type: FieldType.dream,
    description: "Третий сектор экономики формируют организации …",
    choices: [
      {
        id: 0,
        text: "Частные коммерческие",
        resources: {}
      },
      {
        id: 1,
        text: "Частные некоммерческие",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Муниципальные",
        resources: {}
      },
      {
        id: 3,
        text: "Государственные",
        resources: {}
      }
    ]
  },
  {
    id: 37,
    type: FieldType.dream,
    description: "Федеральный закон «О некоммерческих организациях» не распространяется на …",
    choices: [
      {
        id: 0,
        text: "Потребительские кооперативы",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Государственные корпорации",
        resources: {}
      },
      {
        id: 2,
        text: "Общественные объединения",
        resources: {}
      },
      {
        id: 3,
        text: "Некоммерческие партнерства",
        resources: {}
      }
    ]
  },
  {
    id: 38,
    type: FieldType.dream,
    description: "Благотворительная организация обязана вести бухгалтерский учет",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 39,
    type: FieldType.dream,
    description: "Благотворительность - оказание безвозмездной или на льготных условиях помощи нуждающимся",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 40,
    type: FieldType.dream,
    description: "Повседневное взаимодействие власти и общества - необходимое условие политической стабильности, экономического процветания страны",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {}
      },
      {
        id: 1,
        text: "Да",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 41,
    type: FieldType.dream,
    description: "Фонд - коммерческая организация?",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Да",
        resources: {}
      }
    ]
  },
  {
    id: 42,
    type: FieldType.dream,
    description: "Все НКО должны иметь Устав?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 43,
    type: FieldType.dream,
    description: "Деятельность НКО способствует самоорганизации граждан?",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {}
      },
      {
        id: 1,
        text: "Да",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 44,
    type: FieldType.dream,
    description: "Некоммерческие организации существуют только в одной организационно-правовой форме?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 45,
    type: FieldType.dream,
    description: "НКО - организация, принадлежащая к коммерческому сектору общества?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 46,
    type: FieldType.dream,
    description: "Гражданин - субъект жизни общества, активно влияющий на процесс его изменений?",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {}
      },
      {
        id: 1,
        text: "Да",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 47,
    type: FieldType.dream,
    description: "Гражданское общество - совокупность ассоциаций людей, неуважающих и несоблюдающих законы государства?",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Да",
        resources: {}
      }
    ]
  },
  {
    id: 48,
    type: FieldType.dream,
    description: "Негражданское общество - совокупность свободных ассоциаций граждан и связей между ними, уважающих законы государства, права человека, влияющих на эти законы и не позволяющих вмешиваться в свою ежедневную деятельность государственным чиновникам",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 49,
    type: FieldType.dream,
    description: "Социальное партнерство - конструктивное взаимодействие представителей всех трех секторов общества - государственного, коммерческого и некоммерческого - при решении социально-значимых проблем",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {}
      },
      {
        id: 1,
        text: "Да",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 50,
    type: FieldType.dream,
    description: "Социальный эффект - главный показатель оценки результатов деятельности некоммерческих субъектов?",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {}
      },
      {
        id: 1,
        text: "Да",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 51,
    type: FieldType.dream,
    description: "Все некоммерческие продукты несут потребителям неопределенный социальный эффект?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 52,
    type: FieldType.dream,
    description: "Некоммерческим организациям разрешено заниматься предпринимательской деятельностью?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 53,
    type: FieldType.dream,
    description: "Социальный эффект - оценочное суждение потребителя о способности продукта удовлетворять его потребности",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 54,
    type: FieldType.dream,
    description: "Благотворительная организация обязана обеспечивать открытый доступ, включая доступ СМИ, к своим ежегодным отчетам?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 55,
    type: FieldType.dream,
    description: "Правоспособность общественного объединения как юридического лица возникает с момента его государственной регистрации?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 56,
    type: FieldType.dream,
    description: "Учредителем некоммерческой организации может быть гражданин, достигший 16 лет?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 57,
    type: FieldType.dream,
    description: "Если некоммерческая организация не осуществляет никакой предпринимательской деятельности, то она может уплачивать некоторые налоги?",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {}
      },
      {
        id: 1,
        text: "Да",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 58,
    type: FieldType.dream,
    description: "Благотворительная организация не вправе расходовать свои средства и использовать свое имущество для поддержки политических партий, движений, групп и компаний",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 59,
    type: FieldType.dream,
    description: "До момента государственной регистрации общественное объединение не приобретает прав юридического лица",
    choices: [
      {
        id: 0,
        text: "Нет",
        resources: {}
      },
      {
        id: 1,
        text: "Да",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 60,
    type: FieldType.dream,
    description: "Некоммерческая организация может выступать в роли должника и кредитора?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 61,
    type: FieldType.dream,
    description: "Некоммерческие организации создаются в результате ее учреждения и в результате реорганизации уже существующей некоммерческой организации",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 62,
    type: FieldType.dream,
    description: "Организация, созданная без образования юридического лица, может быть признана некоммерческой организацией?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 63,
    type: FieldType.dream,
    description: "Какой признак не свойствен некоммерческой организации?",
    choices: [
      {
        id: 0,
        text: "Наличие юридического лица",
        resources: {}
      },
      {
        id: 1,
        text: "Получение прибыли",
        resources: {}
      },
      {
        id: 2,
        text: "Распределение прибыли между участниками организации",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 64,
    type: FieldType.dream,
    description: "Может ли некоммерческая организация вести предпринимательскую деятельность?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {}
      },
      {
        id: 2,
        text: "Может, при соблюдении определенных условий",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 65,
    type: FieldType.dream,
    description: "Некоммерческие организации могут использовать имущество для достижения любых целей?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 66,
    type: FieldType.dream,
    description: "Для какой некоммерческой организации обязательно наличие учредительного договора?",
    choices: [
      {
        id: 0,
        text: "Общественной организации",
        resources: {}
      },
      {
        id: 1,
        text: "Ассоциации",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Учреждения",
        resources: {}
      },
      {
        id: 3,
        text: "Фонда",
        resources: {}
      }
    ]
  },
  {
    id: 67,
    type: FieldType.dream,
    description: "Может ли некоммерческая организация заниматься предпринимательской деятельностью вместо основной деятельности?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 68,
    type: FieldType.dream,
    description: "Какой из следующих видов поступлений в некоммерческую организацию относится к регулярным поступлениям?",
    choices: [
      {
        id: 0,
        text: "Членские взносы",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Взносы в уставной фонд",
        resources: {}
      },
      {
        id: 2,
        text: "Всё предыдущее правильно",
        resources: {}
      }
    ]
  },
  {
    id: 69,
    type: FieldType.dream,
    description: "Некоммерческая организация, не ведущая предпринимательскую деятельность, полностью освобождает от уплаты всех налогов",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 70,
    type: FieldType.dream,
    description: "Общественное объединение – это объединение граждан, которое учреждается государством для реализации некоммерческих целей?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 71,
    type: FieldType.dream,
    description: "Некоммерческая организация, созданная в форме общественного объединения, может функционировать без государственной регистрации и приобретения прав юридического лица?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {
          white: 10
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
    id: 72,
    type: FieldType.dream,
    description: "Для создания общественного объединения число физических лиц должно быть?",
    choices: [
      {
        id: 0,
        text: "Один человек",
        resources: {}
      },
      {
        id: 1,
        text: "Три человека",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Пятнадцать человек",
        resources: {}
      }
    ]
  },
  {
    id: 73,
    type: FieldType.dream,
    description: "Коммерческая организация может быть учредителем общественного объединения",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 75,
    type: FieldType.dream,
    description: "Некоммерческое партнерство может быть создано одним лицом?",
    choices: [
      {
        id: 0,
        text: "Да",
        resources: {}
      },
      {
        id: 1,
        text: "Нет",
        resources: {
          white: 10
        }
      }
    ]
  },
  {
    id: 76,
    type: FieldType.dream,
    description: "Как называются организации, не имеющие извлечение прибыли в качестве основной цели деятельности и не распределяющие полученную прибыль между участниками?",
    choices: [
      {
        id: 0,
        text: "Коммерческие",
        resources: {}
      },
      {
        id: 1,
        text: "Некоммерческие",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Государственные",
        resources: {}
      },
      {
        id: 3,
        text: "Акционерные общества",
        resources: {}
      },
      {
        id: 4,
        text: "Унитарные предприятия",
        resources: {}
      }
    ]
  },
  {
    id: 77,
    type: FieldType.dream,
    description: "Что не может являться целью деятельности некоммерческой организации?",
    choices: [
      {
        id: 0,
        text: "Свободное распространение информации о своей деятельности",
        resources: {}
      },
      {
        id: 1,
        text: "Участие в избирательных кампаниях",
        resources: {}
      },
      {
        id: 2,
        text: "Издательская деятельность",
        resources: {}
      },
      {
        id: 3,
        text: "Извлечение прибыли",
        resources: {
          white: 10
        }
      },
      {
        id: 4,
        text: "Педагогическая деятельность",
        resources: {}
      }
    ]
  },
  {
    id: 78,
    type: FieldType.dream,
    description: "Учредителями общественных организаций могут быть …",
    choices: [
      {
        id: 0,
        text: "Граждане",
        resources: {}
      },
      {
        id: 1,
        text: "Граждане и (или) юридические лица",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Политические партии",
        resources: {}
      }
    ]
  },
  {
    id: 79,
    type: FieldType.dream,
    description: "Общественная организация действует на основании",
    choices: [
      {
        id: 0,
        text: "Учредительного договора",
        resources: {}
      },
      {
        id: 1,
        text: "Устава",
        resources: {
          white: 10
        }
      },
      {
        id: 2,
        text: "Учредительного договора и устава",
        resources: {}
      }
    ]
  },
  {
    id: 80,
    type: FieldType.dream,
    description: "Учредителями автономных некоммерческих организаций могут быть",
    choices: [
      {
        id: 0,
        text: "Граждане",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Граждане и (или) юридические лица",
        resources: {}
      },
      {
        id: 2,
        text: "Некоммерческие орагнизации",
        resources: {}
      }
    ]
  },
  {
    id: 81,
    type: FieldType.dream,
    description: "Автономная некоммерческая организация действует на основании",
    choices: [
      {
        id: 0,
        text: "Устава",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Учредительного договора",
        resources: {}
      },
      {
        id: 2,
        text: "Учредительного договора и устава",
        resources: {}
      }
    ]
  },
  {
    id: 82,
    type: FieldType.dream,
    description: "Фонд действует на основании",
    choices: [
      {
        id: 0,
        text: "Устава",
        resources: {
          white: 10
        }
      },
      {
        id: 1,
        text: "Учредительного договора",
        resources: {}
      },
      {
        id: 2,
        text: "Учредительного договора и устава",
        resources: {}
      }
    ]
  }
] as Dream[];
