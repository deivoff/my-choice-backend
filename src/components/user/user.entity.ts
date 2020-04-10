import { Socket } from 'socket.io';

type Resources = {
  lives: number;
  money: number;
  dark: number;
  light: number;
}

export class User {
  public username!: string;
  public id!: Socket['id'];
  public room?: string;
  public resources?: Resources;
  public circle?: boolean;
  public status?: string;

  constructor(username, id) {
    this.username = username;
    this.id = id;
  }
}
