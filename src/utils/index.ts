import SocketIO from 'socket.io';

export interface Socket<U> extends SocketIO.Socket {
  user?: U;
}

export interface Server<R, U> extends SocketIO.Server {
  sockets: SocketIO.Namespace & {
    connected: {
      [id: string]: Socket<U>
    }
    sockets: {
      [id: string]: Socket<U>
    }
    adapter: SocketIO.Adapter & {
      rooms: SocketIO.Rooms &{
        [key: string]: SocketIO.Room & R
      }
    }
  }
}

