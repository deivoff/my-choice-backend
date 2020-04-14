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

enum FieldType {
  start,
  situation,
  incident,
  offer,
  reaction,
  opportunity,
  dream,
  activity,
  problem
}

enum ResourceType {
  lives = 'lives',
  money = 'money',
  white = 'white',
  dark = 'dark',
}

type Field = {
  description: string;
} & (Start | Situation | Incident | Offer | Reaction | Opportunity | Dream | Activity | Problem)

type Start = {
  type: FieldType.start;
}

type Incident = {
  type: FieldType.incident;
  action: Action;
}

type Situation = Choices & {
  type: FieldType.situation;
}

type Reaction = Choices & {
  type: FieldType.reaction;
}

type Offer = Choices & {
  type: FieldType.offer;
}

type Opportunity = Choices & {
  type: FieldType.opportunity;
}

type Dream = {
  type: FieldType.dream;
}

type Activity = {
  type: FieldType.activity;
  white: number;
}

type Problem = {
  type: FieldType.problem;
  white: number;
}

type Action = {
  less?: Resources;
  more?: Resources;
  result: {
    move?: FieldType;
    resource?: Resources;
    hold?: number;
    gameOver?: true;
  }
}

export type Resources = {
  [key in ResourceType]?: number;
};

type Choices = {
  choices: Option[];
}

type Option = {
  text: string;
  resources: Resources;
}
