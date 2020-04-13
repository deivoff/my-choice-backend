import SocketIO from 'socket.io';
import * as http from 'http';
import { User } from '$components/user';
import { Server, Socket } from 'src/utils';

enum RoomStatus {
  prepare,
  inProgress,
}

type Room = {
  status?: RoomStatus;
}

type Message = {
  name: string;
  message: string;
  color: string;
}

export class Game {
  private Server: Server<Room, User>;

  constructor(port?: number | http.Server) {
    this.Server = SocketIO(port);

    this.Server.on('connection', (socket: Socket<User>) => {
      let room: string;

      socket.on('login', ({ username }) => {
        socket.user = new User(username);

        socket.emit('rooms', {
          rooms: this.getRooms(),
        });

        socket.on('room:create', ({ roomName }) => {
          socket.user!.createRoom(roomName);
          room = roomName;

          socket.join(room);

          this.Server.sockets.adapter.rooms[room].status = RoomStatus.prepare;
          this.sendRooms();
        });

        socket.on('room:choice', ({ roomName }) => {
          socket.user!.choiceRoom(roomName);
          room = roomName;

          socket.join(room);

          console.log(this.getUsersInRoom(room));
          this.sendRooms();
        });

        socket.on('room:leave', () => {
          socket.user!.leaveRoom(room);
          socket.leave(room);

          room = '';
          this.sendRooms();
        });
      });

      socket.on('chat:room-message', (message: Message) => {
        if (socket.user!.roomName) {
          this.Server.in(socket.user!.roomName).emit('chat:room-message', message)
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

  getUsersInRoom(roomName: string) {
    return Object.values(this.Server.sockets.adapter.rooms[roomName].sockets).map(value => value);
  }
}
