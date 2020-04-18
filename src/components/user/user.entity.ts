import { Resources } from '$utils/index';

export enum UserStatus {
  inGame,
  gameOver,
  hold,
  winner,
}

export class User {
  public username!: string;
  public roomName: string = '';
  public resources: Resources = {};
  public status?: UserStatus;
  public holdCount?: number;
  public admin?: boolean;

  constructor(username) {
    this.username = username;
  }

  gameStart() {
    this.resources = {
      white: 0,
      dark: 0,
      lives: 10,
      money: 0,
    };

    this.status = UserStatus.inGame;
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
