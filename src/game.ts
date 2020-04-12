import SocketIO from 'socket.io';
import * as http from 'http';
import { User } from '$components/user';


interface Socket extends SocketIO.Socket {
  user: User;
}

interface Server extends SocketIO.Server {
  sockets: SocketIO.Namespace & {
    adapter: SocketIO.Adapter & {
      rooms: SocketIO.Rooms &{
        [key: string]: SocketIO.Room & {
          status?: RoomStatus;
        }
      }
    }
  }
}

enum RoomStatus {
  prepare,
  inProgress,
}

type Message = {
  name: string;
  message: string;
  color: string;
}

export class Game {
  private Server: Server;

  constructor(port?: number | http.Server) {
    this.Server = SocketIO(port);

    this.Server.on('connection', (socket: Socket) => {
      socket.on('login', ({ username }) => {
        socket.user = new User(username);

        socket.emit('rooms', {
          rooms: this.getRooms(),
        });

        socket.on('room:create', ({ roomName }) => {
          socket.user.createRoom(roomName);
          socket.join(roomName);

          this.Server.sockets.adapter.rooms[roomName].status = RoomStatus.prepare;
          this.sendRooms();
        });

        socket.on('room:choice', ({ roomName }) => {
          socket.user.choiceRoom(roomName);
          socket.join(roomName);

          this.sendRooms();
        });

        socket.on('room:leave', room => {
          socket.user.leaveRoom(room.roomName);
          socket.leave(room.roomName);

          this.sendRooms();
        });
      });

      socket.on('chat:room-message', (message: Message) => {
        if (socket.user.roomName) {
          this.Server.in(socket.user.roomName).emit('chat:room-message', message)
        }
      });

      socket.on('chat:message', (message: Message) => {
        this.Server.emit('chat:message', message)
      });

      socket.on('disconnect', () => {
        this.sendRooms();
      })
    });
  }

  sendRooms() {
    this.Server.emit('rooms', {
      rooms: this.getRooms(),
    })
  }

  getRooms() {
    return Object.keys(this.Server.sockets.adapter.rooms)
      .filter(roomName => this.Server.sockets.adapter.rooms[roomName].status === RoomStatus.prepare)
      .map(roomName => {
        const userCount = this.Server.sockets.adapter.rooms[roomName].length;

        return {
          roomName,
          userCount
        }
    });
  }
}
