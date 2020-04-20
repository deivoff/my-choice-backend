import { FieldType, Incident } from '$components/field';

export default [
  {
    id: 0,
    type: FieldType.incident,
    description: "Наградили орденом. Если у вас 10 СК(Б), перейдите на клетку «Возможность».",
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
    description: "Арестовали. Если у Вас 3 СК(Ч) или более, вы проиграли.",
    action: {
      more: {
        dark: 3,
      },
      result: {
        gameover: true,
      }
    }
  },
  {
    id: 2,
    type: FieldType.incident,
    description: "Покушение на убийство. Если у вас 5 СК(Ч) или более и менее 2 Ж, вы проиграли.",
    action: {
      less: {
        lives: 2,
      },
      more: {
        dark: 5,
      },
      result: {
        gameover: true,
      }
    }
  },
  {
    id: 3,
    type: FieldType.incident,
    description: "Избили. Если у вас 2 СК(Ч) или более, потеряйте 5 Ж.",
    action: {
      more: {
        dark: 2,
      },
      result: {
        resources: {
          lives: -5,
        },
      }
    }
  },
  {
    id: 4,
    type: FieldType.incident,
    description: "Получили травму. Потеряйте 5 Ж.",
    action: {
      result: {
        resources: {
          lives: -5,
        },
      }
    }
  },
  {
    id: 5,
    type: FieldType.incident,
    description: "Предложили получить бесплатное дополнительное образование. Если у Вас 3 СК(Б) и более, получите 1 СК(Б).",
    action: {
      more: {
        white: 3,
      },
      result: {
        resources: {
          white: 1,
        },
      }
    }
  },
  {
    id: 6,
    type: FieldType.incident,
    description: "Забрали в армию или вышли замуж. Получите 5 СК(Б). Пропускаете 2 хода.",
    action: {
      result: {
        hold: 2,
        resources: {
          white: 5,
        },
      }
    }
  },
  {
    id: 7,
    type: FieldType.incident,
    description: "Попали в секту. Если у вас 3 СК(Ч) и более, вы проиграли.",
    action: {
      more: {
        dark: 3,
      },
      result: {
        gameover: true,
      }
    }
  },
  {
    id: 8,
    type: FieldType.incident,
    description: "Заболели. Если у вас 2 Ж или менее, пропустите 2 хода.",
    action: {
      less: {
        lives: 3,
      },
      result: {
        hold: 2,
      }
    }
  },
  {
    id: 9,
    type: FieldType.incident,
    description: "Ограбили. Если у Вас 100₽ или более, и 2 СК(Ч) или более, потеряйте все ₽.",
    action: {
      more: {
        money: 100,
        dark: 2,
      },
      result: {
        resources: {
          money: 0
        },
      }
    }
  },
  {
    id: 10,
    type: FieldType.incident,
    description: "Вручили благодарственное письмо от президента. Перейдите на клетку «Возможность», получите 5 СК(Б).",
    action: {
      result: {
        move: FieldType.opportunity,
        resources: {
          white: 5
        },
      }
    }
  },
  {
    id: 11,
    type: FieldType.incident,
    description: "Остановила полиция для профилактического досмотра. Если у Вас 3 СК(Ч) или более, вы попали в тюрьму – пропустите 3 хода.",
    action: {
      more: {
        dark: 3,
      },
      result: {
        hold: 3,
      }
    }
  },
  {
    id: 12,
    type: FieldType.incident,
    description: "Покушение на убийство. Если у вас 5 СК(Ч) или более и менее 2 Ж, вы проиграли.",
    action: {
      more: {
        dark: 5,
      },
      less: {
        lives: 2,
      },
      result: {
        gameover: true,
      }
    }
  },
  {
    id: 13,
    type: FieldType.incident,
    description: "Избили. Если у вас 2 СК(Ч) или более, потеряйте 5 Ж.",
    action: {
      more: {
        dark: 2,
      },
      result: {
        resources: {
          lives: -5,
        },
      }
    }
  },
  {
    id: 14,
    type: FieldType.incident,
    description: "Предложили стажировку в крупной солидной компании. Если у Вас 3 СК(Б) или более, получите 1 СК(Б) и 50₽.",
    action: {
      more: {
        white: 3,
      },
      result: {
        resources: {
          white: 5,
          money: 50,
        },
      }
    }
  },
  {
    id: 15,
    type: FieldType.incident,
    description: "Вас вербуют в террористическую организацию. Если у вас 3 СК(Ч) и более, вы проиграли.",
    action: {
      more: {
        dark: 3,
      },
      result: {
        gameover: true,
      }
    }
  },
  {
    id: 16,
    type: FieldType.incident,
    description: "Заболели. Если у вас 8 Ж или менее, пропустите 2 хода.",
    action: {
      less: {
        lives: 9,
      },
      result: {
        hold: 2,
      }
    }
  },
  {
    id: 17,
    type: FieldType.incident,
    description: "Ограбили. Если у Вас 50₽ или более и 2 СК(Ч) или более, потеряйте все ₽.",
    action: {
      more: {
        money: 50,
        dark: 2,
      },
      result: {
        resources: {
          money: 0
        },
      }
    }
  },
  {
    id: 18,
    type: FieldType.incident,
    description: "Вас задержали сотрудники правоохранительных органов. Если больше 2 СК(Ч) – Вы попали в тюрьму. Пропустите 2 хода.",
    action: {
      more: {
        dark: 3,
      },
      result: {
        hold: 2
      }
    }
  },
  {
    id: 19,
    type: FieldType.incident,
    description: "На Вас напали хулиганы и попытались избить. Если больше 8 Ж – Вы убежали, если больше 8 СК(Ч) - Вы договорились. В других случаях – Вы получили травму. Пропустите 2 хода и потеряйте 3 Ж.",
    action: {
      less: {
        lives: 8
      },
      more: {
        dark: 9,
      },
      result: {
        hold: 2,
        resources: {
          lives: -3,
        }
      }
    }
  },
  {
    id: 20,
    type: FieldType.incident,
    description: "Шли домой и поскользнулись. Если меньше 10 Ж – Вы получили травму. Пропустите 2 хода и потеряйте 3 Ж.",
    action: {
      less: {
        lives: 10
      },
      result: {
        hold: 2,
        resources: {
          lives: -3,
        }
      }
    }
  },
  {
    id: 21,
    type: FieldType.incident,
    description: "Предложили получить бесплатное дополнительное образование с дальнейшим трудоустройством. Если у Вас 5 СК(Б) и более, и нет СК(Ч) – Вас приняли. Получите 50₽.",
    action: {
      less: {
        dark: 1,
      },
      more: {
        white: 5,
      },
      result: {
        resources: {
          money: 50,
        }
      }
    }
  },
  {
    id: 22,
    type: FieldType.incident,
    description: "Попали в плохую компанию, где употребляют психоактивные вещества. Если у Вас менее 5 СК(Б) – Вы остались «тусить» и стали жертвой воровства. Потеряйте все ₽.",
    action: {
      less: {
        white: 6,
      },
      result: {
        resources: {
          money: 0,
        }
      }
    }
  },
  {
    id: 23,
    type: FieldType.incident,
    description: "Заболели. Если 5 Ж и менее – пропустите 1 ход.",
    action: {
      less: {
        lives: 6,
      },
      result: {
        hold: 1,
      }
    }
  },
  {
    id: 24,
    type: FieldType.incident,
    description: "Вас вербуют в молодежную банду. Если у Вас 3 СК(Ч) и более – Вы поддались вербовке и попали в тюрьму. Пропустите 3 хода и потеряйте 3 Ж.",
    action: {
      more: {
        dark: 3,
      },
      result: {
        hold: 3,
        resources: {
          lives: -3,
        }
      }
    }
  },
  {
    id: 25,
    type: FieldType.incident,
    description: "Вы сильно поссорились с родителями. Если у Вас 2 СК(Ч) и более – Вы ушли в депрессию, так как Вас некому поддержать. В этом случае пропустите 1 ход.",
    action: {
      more: {
        dark: 2,
      },
      result: {
        hold: 1,
      }
    }
  },
  {
    id: 26,
    type: FieldType.incident,
    description: "У Вас появилась возможность попасть на кастинг для съемок клипа любимой группы. Если более 5 СК(Б) и 5 Ж – Вы прошли. Получите 100₽.",
    action: {
      more: {
        lives: 5,
        white: 5,
      },
      result: {
        resources: {
          money: 100,
        }
      }
    }
  },
  {
    id: 27,
    type: FieldType.incident,
    description: "У Ваших родителей юбилей со дня свадьбы. Отдайте 10₽ на покупку подарка.",
    action: {
      result: {
        resources: {
          money: -10,
        }
      }
    }
  },
  {
    id: 28,
    type: FieldType.incident,
    description: "Вашего близкого друга поставили на учет в детскую комнату полиции. Если 2 СК(Ч) и более – Вы в одиночестве и депрессии. Пропустите 2 хода.",
    action: {
      more: {
        dark: 2,
      },
      result: {
        hold: 2,
      }
    }
  },
  {
    id: 29,
    type: FieldType.incident,
    description: "Вам предложили пройти хорошооплачиваемую летнюю практику. Если нет СК(Ч) – Вас приняли. Получите 50₽.",
    action: {
      less: {
        dark: 1,
      },
      result: {
        resources: {
          money: 50,
        },
      }
    }
  },
  {
    id: 30,
    type: FieldType.incident,
    description: "У Вас произошел разрыв отношений с близким другом/подругой. Если менее 5 СК(Б) – Вы в депрессии. Пропустите 1 ход.",
    action: {
      less: {
        white: 5,
      },
      result: {
        hold: 1,
      }
    }
  },
  {
    id: 31,
    type: FieldType.incident,
    description: "Вы потеряли кошелек. Если более 5 СК(Б) – Вам его вернули, если менее – отдайте 10₽.",
    action: {
      less: {
        white: 5,
      },
      result: {
        resources: {
          money: -10,
        },
      }
    }
  },
  {
    id: 32,
    type: FieldType.incident,
    description: "Вы сдаете нормы ГТО. Если более 10 Ж – Вы сдали на отлично. Получите 5 СК(Б).",
    action: {
      more: {
        lives: 10,
      },
      result: {
        resources: {
          white: 5,
        },
      }
    }
  },
  {
    id: 33,
    type: FieldType.incident,
    description: "Друзья позвали в кино. Отдайте 10₽ на билет.",
    action: {
      result: {
        resources: {
          money: -10,
        },
      }
    }
  },
  {
    id: 34,
    type: FieldType.incident,
    description: "В классе объявили карантин из-за вируса гриппа. Если меньше 5 Ж – Вы заболели – пропустите 1 ход.",
    action: {
      less: {
        lives: 5,
      },
      result: {
        hold: 1,
      }
    }
  },
  {
    id: 35,
    type: FieldType.incident,
    description: "На уроке физкультуры Вы поскользнулись и упали. Если менее 5Ж – сломали ногу. Пропустите 2 хода.",
    action: {
      less: {
        lives: 5,
      },
      result: {
        hold: 2,
      }
    }
  },
] as Incident[];
