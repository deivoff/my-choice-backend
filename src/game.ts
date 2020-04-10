import socketIo, { Server, Socket } from 'socket.io';
import * as http from 'http';

export class Game {
  private Server: Server;

  constructor(port?: number | http.Server) {
    this.Server = socketIo(port);

    this.Server.on('connection', (socket: Socket) => {
      socket.on('chat:message', ({ name, message, color }) => {
        this.Server.emit('chat:message', { name, message, color })
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      })
    });
  }
}
