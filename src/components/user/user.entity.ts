import {
  Action, Choice, Resources,
  FIELDS, INNER_FIELDS_COUNT,
  FieldType, ResourceType, FROM_INNER_TO_OUTER, OUTER_FIELDS_COUNT,
} from '$components/field';

export enum UserStatus {
  inGame,
  gameOver,
  hold,
  winner,
}

export enum PositionType {
  start = 'start',
  inner = 'inner',
  outer = 'outer',
}

type UserPosition = {
  type: PositionType;
  cell: number;
}

export class User {
  public username!: string;
  public roomName: string = '';
  public resources: Resources = {};
  public gameover: boolean = false;
  public dream?: number;
  public status?: UserStatus;
  public position?: UserPosition;
  public priority?: number;
  public hold?: number;
  public admin?: boolean;

  constructor(username) {
    this.username = username;
  }

  setPriority(priority: number) {
    this.priority = priority;
  }

  gameStart() {
    this.resources = {
      white: 0,
      dark: 0,
      lives: 10,
      money: 0,
    };

    this.status = UserStatus.inGame;
    this.position = {
      type: PositionType.start,
      cell: 0,
    }
  }

  setDream(fieldNumber: number | string) {
    this.dream = Number(`${fieldNumber}`);
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
          return;
        }

        if (action.result.move) {
          this.setPosition(action.result.move)
        }

        if (action.result.hold) {
          this.hold = action.result.hold;
        }

        if (action.result.gameover) {
          this.gameover = true;
        }
    }
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

  updateAfterChoice(choice: Choice) {
    if (choice.type === FieldType.opportunity) {
      if (choice.resources) {
        this.setResources(choice.resources);
      }

      if (choice.outer) {
        this.setPosition(0, PositionType.outer);
      }
    } else if (choice.type === FieldType.incident) {
      const { id, type } = choice;

      const { action } = FIELDS[type]![id];

      this.setAction(action)
    } else {
        const { id, choiceId, type } = choice;
        const { resources } = FIELDS[type]![id].choices[choiceId];
        this.setResources(resources);
    }
  }

  getCurrentRoom() {
    return this.roomName;
  }

  createRoom(roomName) {
    this.roomName = roomName;
    this.admin = true;
  }

  choiceRoom(roomName) {
    this.roomName = roomName;
  }

  leaveRoom() {
    this.roomName = '';

    if (this.admin) {
      this.admin = false;
    }
  }
}
