import SocketIO from 'socket.io';
import * as http from 'http';
import { PositionType, User } from '$components/user';
import { RoomInstance } from '$components/room';
import { Server, Socket } from '$utils/index';
import { InnerFieldDictionary } from '$components/field';


type Room = {
  room?: RoomInstance;
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
      socket.on('login', ({ username }) => {
        socket.user = new User(username);

        socket.emit('rooms', {
          rooms: this.getRooms(),
        });

        socket.on('room:create', ({ roomName }) => {
          socket.user!.createRoom(roomName);
          socket.join(roomName);

          this.Server.sockets.adapter.rooms[roomName].room = new RoomInstance(roomName);
          this.sendRooms();
        });

        socket.on('room:choice', ({ roomName }) => {
          socket.user!.choiceRoom(roomName);

          socket.join(roomName);

          this.sendPlayers(roomName);
          this.sendRooms();
        });

        socket.on('room:leave', () => {
          const room = socket.user!.getCurrentRoom();
          const userIds = this.getUsersInRoom(room);

          socket.leave(room);
          if (userIds.length) {
            this.sendPlayers(room);
          }

          socket.user!.leaveRoom();
          this.sendRooms();
        });

        socket.on('game:start', () => {
          const room = socket.user!.getCurrentRoom();

          this.gameStart(room);
        });

        socket.on('game:dream', dreamId => {
          const room = socket.user!.getCurrentRoom();
          socket.user!.setDream(dreamId);

          this.sendPlayersWithDream(room);
        });

        socket.on('game:move', (move: number) => {
          const room = socket.user!.getCurrentRoom();
          socket.user!.setPosition(move);

          this.sendPlayersWithCard(room, socket.user!.priority!);
        });

        socket.on('game:choice', choice => {
          console.log(choice);
          const room = socket.user!.getCurrentRoom();

          this.sendPlayersWithNext(room, socket.user!.priority!);
        });
      });

      socket.on('chat:room-message', (message: Message) => {
        const userRoom = socket.user!.getCurrentRoom();
        if (userRoom) {
          this.Server.in(userRoom).emit('chat:room-message', message)
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

  sendPlayers(roomName: string) {
    this.Server.in(roomName).emit('game:players', this.getUsersInRoom(roomName))
  }

  sendPlayersWithDream(roomName: string) {
    const users = this.getUsersInRoom(roomName);
    const dreamsExist = users.every(user => user.dream !== undefined);

    this.Server.in(roomName).emit('game:players', users.map(user => {
      if (user.priority === 0 && dreamsExist) {
        return {
          ...user,
          currentMove: true
        }
      }

      return user;
    }))
  }

  sendPlayersWithNext(roomName: string, currentPlayer: number) {
    const users = this.getUsersInRoom(roomName);
    const usersCount = users.length;
    const nextPlayer = (currentPlayer + 1) % usersCount;

    this.Server.in(roomName).emit('game:players', users.map(user => {
      if (user.priority === nextPlayer) {
        return {
          ...user,
          currentMove: true
        }
      }

      return user;
    }))
  }

  sendPlayersWithCard(roomName: string, currentPlayer: number) {
    const users = this.getUsersInRoom(roomName);

    this.Server.in(roomName).emit('game:players', users.map(user => {
      if (user.priority === currentPlayer) {
        const { type, cell } = user.position!;
        if (type === PositionType.inner)
          return {
            ...user,
            card: InnerFieldDictionary[cell]
          }
      }

      return user;
    }))
  }

  getRooms() {
    return Object.keys(this.Server.sockets.adapter.rooms)
      .filter(roomName => (
        this.Server.sockets.adapter.rooms[roomName].room?.isAwait()) &&
        this.Server.sockets.adapter.rooms[roomName].length <= 8
      )
      .map(roomName => {
        const userCount = this.Server.sockets.adapter.rooms[roomName].length;

        return {
          roomName,
          userCount
        }
    });
  }

  gameStart(roomName: string) {
    const users = this.getUsersInRoom(roomName);

    this.Server.sockets.adapter.rooms[roomName].room?.gameStart();
    this.sendRooms();

    this.Server.in(roomName).emit('game:started');
    this.Server.in(roomName).emit('game:players', users.map((user, i) => {
      user.setPriority(i);

      user.gameStart();
    }))
  }

  getUsersInRoom(roomName: string) {
    const userIds = this.Server.sockets.adapter.rooms[roomName]?.sockets;

    if (userIds) {
      const users = Object.keys(userIds).map(userId => {
        return this.Server.sockets.connected[userId].user!;
      });

      if (!users.some(user => user.admin)) {
        users[0].admin = true;
      }

      return users;
    }

    return [];
  }
}
