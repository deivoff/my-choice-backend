import { v4 as uuidv4 } from 'uuid';
import { User } from '$components/user';

export class Room {
  public id!: string;
  public roomname!: string;

  constructor(roomname: string) {
    this.roomname = roomname;
    this.id = uuidv4();
  }
}
