export class User {
  public username!: string;
  public canCreate: boolean = false;
  public roomName: string = '';

  constructor(username) {
    this.username = username;
  }

  getCurrentRoom() {
    return this.roomName;
  }

  disconnect() {}

  createRoom(roomName) {
    this.roomName = roomName;
  }

  choiceRoom(roomName) {
    this.roomName = roomName;
  }

  leaveRoom() {
    this.roomName = '';
  }
}
