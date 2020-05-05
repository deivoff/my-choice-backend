import {
  Action,
  Choice,
  DREAM_FIELDS,
  FIELD_DICTIONARY,
  FIELDS,
  FieldType,
  FROM_INNER_TO_OUTER,
  INNER_FIELDS,
  INNER_FIELDS_COUNT,
  OUTER_FIELDS_COUNT,
  Resources,
  ResourceType,
} from '$components/field';
import { gamelog } from '$components/gamelog';
import { User } from './user.entity';

export enum PlayerStatus {
  game,
  gameover,
  hold,
  winner,
}

export type Share = {
  exchange: ResourceType,
  for: ResourceType,
}

export enum PositionType {
  start = 'start',
  inner = 'inner',
  outer = 'outer',
}

type PlayerPosition = null | {
  type: PositionType;
  cell: number;
}

export class Player extends User {
  public resources: Resources = {};
  public gameover: boolean = false;
  public dream: null | number = null;
  public status?: PlayerStatus;
  public currentMove: boolean = false;
  public winner: boolean = false;
  public position: PlayerPosition = null;
  public priority: null | number = null;
  public hold: null | number = null;
  public admin?: boolean;

  setPriority(priority: number) {
    this.priority = priority;
  }

  setCurrentMove() {
    this.currentMove = true;
  }

  removeCurrentMove() {
    this.currentMove = false;
  }

  share(share: Share) {
    if (share.exchange === ResourceType.dark) {
      this.resources.dark = this.resources!.dark! - 1;

      if (share.for === ResourceType.money) {
        this.resources.money = this.resources!.money! - 50;
      }

      if (share.for === ResourceType.white) {
        this.resources.white = this.resources!.white! - 5;
      }

      if (share.for === ResourceType.lives) {
        this.resources.lives = this.resources!.lives! - 5;
      }

      gamelog({
        user: this.username,
        room: this.roomName,
        message: `${this.username} удалил одну СК(Ч) в обмен на ${share.for}.`
      });
    }

    if (share.exchange === ResourceType.lives) {
      this.resources.lives = this.resources!.lives! + 1;
      this.resources.money = this.resources!.money! - 10;

      gamelog({
        user: this.username,
        room: this.roomName,
        message: `${this.username} обменял 10 монет в обмен на 1 жизнь.`
      });
    }

  }

  win() {
    this.winner = true;

    gamelog({
      user: this.username,
      room: this.roomName,
      win: true,
      message: `${this.username} выиграл.`
    });
  }

  await() {
    this.hold && this.hold--;

    gamelog({
      user: this.username,
      room: this.roomName,
      hold: true,
      message: `${this.username} пропускает 1 из ${this.hold} ходов.`
    });
  }

  gameStart() {
    this.resources = {
      white: 0,
      dark: 0,
      lives: 10,
      money: 0,
    };

    this.status = PlayerStatus.game;
    this.position = {
      type: PositionType.start,
      cell: 0,
    };

    gamelog({
      user: this.username,
      room: this.roomName,
      message: `${this.username} начал игру.`
    });
  }

  setDream(fieldNumber: number | string) {
    this.dream = Number(`${fieldNumber}`);

    gamelog({
      user: this.username,
      room: this.roomName,
      message: `${this.username} выбрал ${this.dream} как мечту.`
    });
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
    let isFieldChange = false;

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
        this.setInnerFieldPosition(action.result.move);

        isFieldChange = true
      }

      if (action.result.gameover) {
        this.gameover = true;
      }
    }

    return isFieldChange;
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
      let isFieldChanged = false;
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
        isFieldChanged = true;
      }

      gamelog({
        user: this.username,
        room: this.roomName,
        message
      });

      return isFieldChanged;
    } else if (choice.type === FieldType.incident) {
      const { id, type } = choice;

      const { action, description } = FIELDS[type]![id];

      const changeMove = this.setAction(action);

      gamelog({
        user: this.username,
        room: this.roomName,
        message: `${this.username} встал на поле №${this.position!.cell}, произошел случай №${id} "${description}".`
      });

      return changeMove;
    } else {
      const { id, choiceId, type } = choice;
      const { description, choices: { [choiceId]: { resources, text }} } = FIELDS[type]![id];

      this.setResources(resources);

      gamelog({
        user: this.username,
        room: this.roomName,
        choice,
        message: `${this.username} встал на поле №${this.position!.cell} в карточке ${FIELD_DICTIONARY[type]} №${id} "${description}" выбрал "${text}".`
      });

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
    super.disconnect();

    gamelog({
      user: this.username,
      message: `Игрок ${this.username} отключился.`
    });
  }

  createRoom(roomName) {
    super.createRoom(roomName);
    this.admin = true;

    gamelog({
      user: this.username,
      room: this.roomName,
      message: `${this.username} создал комнату "${this.roomName}".`
    });
  }

  choiceRoom(roomName) {
    super.choiceRoom(roomName);

    gamelog({
      user: this.username,
      room: this.roomName,
      message: `${this.username} вошел в комнату "${this.roomName}".`
    });
  }

  leaveRoom() {
    super.leaveRoom();

    gamelog({
      user: this.username,
      room: this.roomName,
      message: `${this.username} покинул комнату "${this.roomName}".`
    });

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
