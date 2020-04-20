import { FIELDS } from '$components/field/field.dictionaries';

export const enum FieldType {
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

export type Field = {
  id: number,
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

type Opportunity = {
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
  id: number,
  text: string;
  resources: Resources;
}

export const INNER_FIELDS_COUNT = 20;
const OFFERS_FIELDS = [0, 4, 8, 12, 17];
const SITUATIONS_FIELDS = [1, 7, 9, 13, 18];
const INCIDENTS_FIELDS = [2, 6, 10, 15, 19];
const OPPORTUNITIES_FIELDS = [3, 11, 16];
const REACTION_FIELDS = [5, 14];

type FieldDictionary = {
  [key: number]: ({ card: Field } | {});
}

const arrRand = <T>(array: T[]): T => {
  const random = Math.floor(Math.random() * array.length);

  return array[random];
};

export const InnerFieldDictionary = new Proxy<FieldDictionary>({}, {
  get: (target, p: number | string) => {
    const position = Number(`${p}`);

    if (OFFERS_FIELDS.includes(position)) {
      return { card: arrRand(FIELDS[FieldType.offer]!) }
    }

    if (SITUATIONS_FIELDS.includes(position)) {
      return { card: arrRand(FIELDS[FieldType.situation]!) }
    }

    if (INCIDENTS_FIELDS.includes(position)) {
      return { card: arrRand(FIELDS[FieldType.incident]!) }
    }


    if (REACTION_FIELDS.includes(position)) {
      return { card: arrRand(FIELDS[FieldType.reaction]!) }
    }

    if (OPPORTUNITIES_FIELDS.includes(position)) {
      return {card: FIELDS[FieldType.opportunity]![0]}
    }

  }
});
