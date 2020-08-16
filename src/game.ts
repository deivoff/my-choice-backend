import SocketIO from 'socket.io';
import * as http from 'http';
import { PositionType, Player, createUser, Moderator, Share } from '$components/user';
import { RoomInstance } from '$components/room';
import { Server, Socket } from '$utils/index';
import {
  Choice,
  InnerFieldDictionary,
  OuterFieldDictionary,
  OPTION_CHOICES,
} from '$components/field';


type Room = {
  room?: RoomInstance;
}

type Message = {
  name: string;
  message: string;
  color: string;
}

export class Game {
  private Server: Server<Room, Player | Moderator>;

  constructor(server: http.Server) {
    this.Server = SocketIO(server);

    try {
      this.Server.on('connection', (socket: Socket<Player | Moderator>) => {
        socket.on('login', ({ username }) => {
          socket.user = createUser(username);
          socket.emit('login', socket.user);
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
            const userIds = this.getPlayersInRoom(room);

            socket.leave(room);
            if (userIds.length) {
              this.sendPlayers(room);
            }

            socket.user!.leaveRoom();
            this.sendRooms();
          });

          if (socket.user instanceof Player) {
            this.subscribeSocketAsPlayer(socket as Socket<Player>);
          }
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
          if (socket.user) {
            const userRoom = socket.user.getCurrentRoom();
            socket.user.disconnect();
            if (userRoom && socket.user instanceof Player) {
              this.sendPlayers(userRoom);

              if (socket.user.currentMove) {
                socket.user.removeCurrentMove();

                this.sendPlayersWithNext(userRoom, socket.user!.priority! + 1);
              }
            }
          }

          this.sendRooms();
        })
      });
    } catch (e) {
      this.Server.emit('game:error');
      throw e;
    }
  }

  subscribeSocketAsPlayer(socket: Socket<Player>) {
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
      socket.user!.removeCurrentMove();
      socket.user!.setPosition(move);

      this.sendPlayersWithCard(room, socket.user!.priority!);
    });

    socket.on('game:choice', (choice: Choice) => {
      const room = socket.user!.getCurrentRoom();

      const isFieldChanged = socket.user!.updateAfterChoice(choice);

      if (OPTION_CHOICES.includes(choice.type)) {
        socket.in(room).emit('game:user-choice', `${choice['choiceId']}`);
      }
      if (socket.user!.winner) {
        setTimeout(() => {
          this.Server.in(room).emit('game:players', this.getPlayersInRoom(room))
        }, 1000);
      } else if (isFieldChanged) {
        this.sendPlayersWithCard(room, socket.user!.priority!);
      } else {
        this.sendPlayersWithNext(room, socket.user!.priority! + 1);
      }
    });

    socket.on('game:share', (share: Share) => {
      const room = socket.user!.getCurrentRoom();
      socket.user!.share(share);

      this.sendPlayers(room);
    })
  }

  sendRooms() {
    this.Server.emit('rooms', {
      rooms: this.getRooms(),
    })
  }

  sendPlayers(roomName: string) {
    this.Server.in(roomName).emit('game:players', this.getPlayersInRoom(roomName))
  }

  sendPlayersWithDream(roomName: string) {
    const users = this.getPlayersInRoom(roomName);
    const dreamsExist = users.every(user => user.dream);

    this.Server.in(roomName).emit('game:players', users.map(user => {
      if (user.priority === 0 && dreamsExist) {

        user.setCurrentMove();
        return user;
      }

      return user;
    }))
  }

  sendPlayersWithNext(roomName: string, nextPlayer: number) {
    const users = this.getPlayersInRoom(roomName);
    const usersWithMover = getUserWithMover(users, nextPlayer);

    usersWithMover
      ? this.Server.in(roomName).emit('game:players', usersWithMover)
      : this.Server.in(roomName).emit('game:error')
  }

  sendPlayersWithCard(roomName: string, currentPlayer: number) {
    const users = this.getPlayersInRoom(roomName);
    let moveCancel = false;

    const newUsers = users.map(user=> {
      if (user.priority === currentPlayer) {
        const { type, cell } = user.position!;

        if (type === PositionType.inner) {
          return {
            ...user,
            ...InnerFieldDictionary[cell]
          }
        }

        if (type === PositionType.outer) {
          const result = OuterFieldDictionary(user.dream!, user.resources!.white!)[cell];
          moveCancel = true;

          if (typeof result === 'number') {
            user.setResources({ white: result });

            return user;
          }

          if (result) {
            moveCancel = false;
            return {
              ...user,
              ...result,
            }
          } else {
            user.win();
            return user;
          }
        }
      }

      return user;
    });

    moveCancel
      ? this.sendPlayersWithNext(roomName, currentPlayer + 1)
      : this.Server.in(roomName).emit('game:players', newUsers)
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
    const users = this.getPlayersInRoom(roomName);

    this.Server.sockets.adapter.rooms[roomName].room?.gameStart();
    this.sendRooms();

    this.Server.in(roomName).emit('game:started');
    this.Server.in(roomName).emit('game:players', users.map((user, i) => {
      user.setPriority(i);
      user.gameStart();

      return user;
    }))
  }

  getPlayersInRoom(roomName: string) {
    const userIds = this.Server.sockets.adapter.rooms[roomName]?.sockets;

    if (userIds) {
      const players: Player[] = Object
        .keys(userIds)
        .map(userId => this.Server.sockets.connected[userId].user!)
        .filter(user => user instanceof Player) as Player[];

      if (players.length && !players.some(user => user.admin)) {
        players[0].admin = true;
      }

      return players;
    }

    return [];
  }
}

function getUserWithMover(users: Partial<Player>[], currentPlayer, deep: number = 3) {
  const activeUsers = users.filter(user => !user.gameover);
  if (!deep) {
    return null;
  }

  if (activeUsers.length === 0) {
    return users;
  }

  if (activeUsers.length === 1) {
    if (activeUsers[0].win) {
      activeUsers[0].win();
    }

    return users;
  }

  const usersCount = users.length;
  let isCurrentMoverSet = false;
  let nextPlayer = currentPlayer % usersCount;

  const newUsers = users.map((user, i) => {
    if (user.priority !== i && user.setPriority) {
      user.setPriority(i);
    }
    if (user.priority === nextPlayer) {
      if (user.gameover) {
        nextPlayer = nextPlayer + 1;
        return user;
      }

      if (user.hold) {
        nextPlayer = nextPlayer + 1;
        user.await && user.await();

        return user;
      }

      isCurrentMoverSet = true;
      user.setCurrentMove && user.setCurrentMove!();
      return user
    }

    return user;
  });

  if (isCurrentMoverSet) {
    return newUsers;
  }

  return getUserWithMover(newUsers, nextPlayer, deep - 1)
}
