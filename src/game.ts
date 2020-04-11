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

  constructor(port?: number | http.Server) {
    this.Server = socketIo(port);

    this.Server.on('connection', (socket) => {
      let user: User;
      socket.on('login', ({ username }) => {
        user = this.addUser(username, socket.id);

        socket.emit('rooms', {
          rooms: this.getRooms(),
        });

        socket.on('room:create', ({ roomname }) => {
          const room = this.addRoom(roomname);

          socket.join(room.id);
          this.sendRooms();
        });

        socket.on('room:choice', room => {
          socket.join(room.id);
          this.sendRooms();
        })
      });

      socket.on('chat:message', ({ name, message, color }) => {
        this.Server.emit('chat:message', { name, message, color })
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
        this.deleteUser(socket.id);
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

  deleteUser(id: string) {
    delete this.users.byId[id];
    this.users.ids = this.users.ids.filter(userId => userId !== id);
  }

  sendRooms() {
    this.Server.emit('rooms', {
      rooms: this.getRooms(),
    })
  }

  getRooms() {
    return Object.keys(this.Server.adapter).map(room => {
      const userCount = this.Server.in(room).clients.length;

      return {
        ...this.rooms.byId[room],
        userCount
      }
    });
  }
}
