
type Resources = {
  lives: number;
  money: number;
  dark: number;
  light: number;
}

export class User {
  public username!: string;
  public roomName?: string;
  public resources?: Resources;
  public circle?: boolean;
  public status?: string;
  public admin?: boolean;

  constructor(username) {
    this.username = username;
  }

  createRoom(roomName) {
    this.roomName = roomName;
    this.admin = true;
  }

  choiceRoom(roomName) {
    this.roomName = roomName;
  }

  leaveRoom(roomName) {
    this.roomName = '';

    if (this.admin) {
      this.admin = false;
    }
  }
}
