import socketIo, { Server, Socket as SocketIo } from 'socket.io';
import * as http from 'http';
import { User } from '$components/user';


interface Socket extends SocketIo {
  user: User;
}

export class Game {
  private Server: Server;

  constructor(port?: number | http.Server) {
    this.Server = socketIo(port);

    this.Server.on('connection', (socket: Socket) => {
      socket.on('login', ({ username }) => {
        socket.user = new User(username, socket.id);

        socket.emit('rooms', {
          rooms: this.getRooms(),
        });

        socket.on('room:create', ({ roomName }) => {
          socket.join(roomName);
          this.sendRooms();
        });

        socket.on('room:choice', room => {
          socket.join(room.roomName);
          this.sendRooms();
        })
      });

      socket.on('chat:message', ({ name, message, color }) => {
        this.Server.emit('chat:message', { name, message, color })
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      })
    });
  }

  sendRooms() {
    this.Server.emit('rooms', {
      rooms: this.getRooms(),
    })
  }

  getRooms() {
    return Object.keys(this.Server.sockets.adapter.rooms).map(roomName => {
      const userCount = this.Server.sockets.adapter.rooms[roomName].length;

      return {
        roomName,
        userCount
      }
    });
  }
}
