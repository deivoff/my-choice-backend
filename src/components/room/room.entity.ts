import { v4 as uuidv4 } from 'uuid';

export class Room {
  public id!: string;
  public roomname!: string;
  constructor(roomname) {
    this.roomname = roomname;
    this.id = uuidv4();
  }
}
