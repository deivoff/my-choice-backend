import { Resources } from '$utils/index';

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
  public dream?: number;
  public status?: UserStatus;
  public position?: UserPosition;
  public priority?: number;
  public holdCount?: number;
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

  setDream(id: number) {
    this.dream = id;
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
