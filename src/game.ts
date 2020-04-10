import socketIo, { Server } from 'socket.io';
import * as http from 'http';
import { User } from '$components/user';
import { Room } from '$components/room';

type Users = {
  byId: {
    [key in User['id']]: User;
  },
  ids: User['id'][]
}

type Rooms = {
  byId: {
    [key in Room['id']]: Room;
  },
  ids: Room['id'][]
}

export class Game {
  private Server: Server;

  public users: Users = {
    byId: {},
    ids: [],
  };

  public rooms: Rooms = {
    byId: {},
    ids: [],
  };

  constructor(port?: number | http.Server) {
    this.Server = socketIo(port);

    this.Server.on('connection', (socket) => {
      let user: User;
      socket.on('login', ({ username }) => {
        user = this.addUser(username, socket.id);

        socket.broadcast.emit('rooms', {
          rooms: this.rooms.byId,
        });

        socket.on('room:create', ({ roomname }) => {
          const room = this.addRoom(roomname);

          socket.join(room.id);
          socket.emit('rooms', this.rooms.byId)
        });

        socket.on('room:choice', room => {

          socket.join(room.id);
          socket.emit('rooms', {
            rooms: this.rooms.byId,
          })
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

  addUser(username: string, id: string) {
    const user = new User(username, id);
    this.users = {
      byId: {
        ...this.users.byId,
        [user.id]: user,
      },
      ids: [...this.users.ids, user.id],
    };

    return user;
  }

  addRoom(roomname: string) {
    const room = new Room(roomname);

    this.rooms = {
      byId: {
        ...this.rooms.byId,
        [room.id]: room,
      },
      ids: [...this.rooms.ids, room.id],
    };

    return room;
  }
}
