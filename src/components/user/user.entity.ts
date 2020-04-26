import {
  Action,
  Choice,
  DREAM_FIELDS, FIELD_DICTIONARY,
  FIELDS,
  FieldType,
  FROM_INNER_TO_OUTER,
  INNER_FIELDS,
  INNER_FIELDS_COUNT,
  OUTER_FIELDS_COUNT,
  Resources,
  ResourceType,
} from '$components/field';
import { GamelogModel } from '$components/gamelog';

export enum UserStatus {
  game,
  gameover,
  hold,
  winner,
}

export enum PositionType {
  start = 'start',
  inner = 'inner',
  outer = 'outer',
}

type UserPosition = null | {
  type: PositionType;
  cell: number;
}

export class User {
  public username!: string;
  public roomName: string = '';
  public resources: Resources = {};
  public gameover: boolean = false;
  public dream: null | number = null;
  public status?: UserStatus;
  public winner: boolean = false;
  public position: UserPosition = null;
  public priority: null | number = null;
  public hold: null | number = null;
  public admin?: boolean;

  constructor(username) {
    this.username = username;
  }

  setPriority(priority: number) {
    this.priority = priority;
  }

  removeDark(changeResource: ResourceType) {
    this.resources.dark = this.resources!.dark! - 1;

    if (changeResource === ResourceType.money) {
      this.resources.money = this.resources!.money! - 50;
    }

    if (changeResource === ResourceType.white) {
      this.resources.white = this.resources!.white! - 5;
    }

    if (changeResource === ResourceType.lives) {
      this.resources.lives = this.resources!.lives! - 5;
    }

    new GamelogModel({
      user: this.username,
      room: this.roomName,
      message: `${this.username} удалил одну СК(Ч) в обмен на ${changeResource}.`
    }).save();
  }

  win() {
    this.winner = true;

    new GamelogModel({
      user: this.username,
      room: this.roomName,
      win: true,
      message: `${this.username} выиграл.`
    }).save();
  }

  await() {
    this.hold && this.hold--;

    new GamelogModel({
      user: this.username,
      room: this.roomName,
      hold: true,
      message: `${this.username} пропускает 1 из ${this.hold} ходов.`
    }).save();
  }

  gameStart() {
    this.resources = {
      white: 0,
      dark: 0,
      lives: 10,
      money: 0,
    };

    this.status = UserStatus.game;
    this.position = {
      type: PositionType.start,
      cell: 0,
    };

    new GamelogModel({
      user: this.username,
      room: this.roomName,
      message: `${this.username} начал игру.`
    }).save();
  }

  setDream(fieldNumber: number | string) {
    this.dream = Number(`${fieldNumber}`);

    new GamelogModel({
      user: this.username,
      room: this.roomName,
      message: `${this.username} выбрал ${this.dream} как мечту.`
    }).save();
  }

  setResources(resources: Resources) {
    Object.keys(resources).forEach((key) => {
      if (resources[key] === 0) {
        this.resources[key] = 0;
      } else {
        this.resources[key] = this.resources[key] + resources[key];

        if (key !== ResourceType.money && this.resources[key] < 0) {
          this.resources[key] = 0;
        }
      }
    });

    if (this.resources.lives! <= 0) {
      this.gameover = true
    }
  }

  setAction(action: Action) {
    let lessCheck = true;
    let moreCheck = true;

    if (action.less) {
      Object.keys(action.less).forEach(key => {
        lessCheck = this.resources[key] < action.less![key]
      })
    }

    if (action.more) {
      Object.keys(action.more).forEach(key => {
        moreCheck = this.resources[key] >= action.more![key]
      })
    }

    if (lessCheck && moreCheck) {
      if (action.result.resources) {
        this.setResources(action.result.resources);
      }

      if (action.result.hold) {
        this.hold = action.result.hold;
      }

      if (action.result.move) {
        this.setInnerFieldPosition(action.result.move)

        return true
      }

      if (action.result.gameover) {
        this.gameover = true;
      }
    }

    return false;
  }

  setPosition(move: number, type?: PositionType) {
    if (this.position?.type === PositionType.start) {
      this.position = {
        type: PositionType.inner,
        cell: move - 1,
      };

      return;
    }

    if (this.position?.type === PositionType.inner && !type) {
      const cell = (this.position.cell + move) % INNER_FIELDS_COUNT;

      this.position = {
        type: PositionType.inner,
        cell,
      };

      return;
    }

    if (this.position?.type === PositionType.outer && !type) {
      const cell = (this.position.cell + move) % OUTER_FIELDS_COUNT;

      this.position = {
        type: PositionType.outer,
        cell,
      };

      return;
    }

    if (type === PositionType.outer) {
      const cell = FROM_INNER_TO_OUTER[this.position!.cell!];

      this.position = {
        type: PositionType.outer,
        cell,
      }
    }
  }

  setInnerFieldPosition(field: FieldType) {
    const nextField = INNER_FIELDS[field].find(elem => this.position!.cell < elem);
    if (!nextField) {
      this.position!.cell = INNER_FIELDS[field][0];

      return;
    }

    this.position!.cell = nextField;
  }

  updateAfterChoice(choice: Choice) {
    if (choice.type === FieldType.opportunity) {
      let message = `Игрок ${this.username} встал на возможность`;
      if (choice.resources) {
        this.setResources(choice.resources);
        Object.keys(choice.resources).forEach(key => {
          message += `, увеличил ресурс ${key} на ${choice.resources![key]}`
        });

      }

      if (choice.outer) {
        this.setPosition(0, PositionType.outer);

        message += `, и перешел на внешний круг`;
        return true;
      }

      new GamelogModel({
        user: this.username,
        room: this.roomName,
        message
      }).save();

      return false;
    } else if (choice.type === FieldType.incident) {
      const { id, type } = choice;

      const { action, description } = FIELDS[type]![id];

      const changeMove = this.setAction(action);

      new GamelogModel({
        user: this.username,
        room: this.roomName,
        message: `${this.username} встал на поле №${this.position!.cell}, произошел случай №${id} "${description}".`
      }).save();

      return changeMove;
    } else {
      const { id, choiceId, type } = choice;
      const { description, choices: { [choiceId]: { resources, text }} } = FIELDS[type]![id];

      this.setResources(resources);

      new GamelogModel({
        user: this.username,
        room: this.roomName,
        choice,
        message: `${this.username} встал на поле №${this.position!.cell} в карточке ${FIELD_DICTIONARY[type]} №${id} "${description}" выбрал "${text}".`
      }).save();

      if (
        type === FieldType.dream
        && this.position!.cell === this.dream
        && this.resources!.white! >= DREAM_FIELDS[this.position!.cell]
      ) {
        this.win();
      }

      return;
    }
  }

  getCurrentRoom() {
    return this.roomName;
  }

  disconnect() {
    new GamelogModel({
      user: this.username,
      message: `Игрок ${this.username} отключился.`
    }).save();
  }

  createRoom(roomName) {
    this.roomName = roomName;
    this.admin = true;

    new GamelogModel({
      user: this.username,
      room: this.roomName,
      message: `${this.username} создал комнату "${this.roomName}".`
    }).save();
  }

  choiceRoom(roomName) {
    this.roomName = roomName;

    new GamelogModel({
      user: this.username,
      room: this.roomName,
      message: `${this.username} вошел в комнату "${this.roomName}".`
    }).save();
  }

  leaveRoom() {
    new GamelogModel({
      user: this.username,
      room: this.roomName,
      message: `${this.username} покинул комнату "${this.roomName}".`
    }).save();
    this.roomName = '';
    this.admin = false;
    this.resources = {};
    this.position = null;
    this.gameover = false;
    this.dream = null;
    this.winner = false;
    this.priority = null;
    this.hold = null;
  }
}
