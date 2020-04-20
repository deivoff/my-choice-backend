import { FIELDS } from '$components/field/dictionaries';

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

export enum ResourceType {
  lives = 'lives',
  money = 'money',
  white = 'white',
  dark = 'dark',
}

type Fields = Start | Incident | Situation | Reaction | Offer | Opportunity | Dream | Activity | Problem
export type Default = {
  id: number,
  description: string;
}
export type Choice = (OptionChoice | OpportunityChoice | IncidentChoice)

type OptionChoice = {
  id: number;
  type: FieldType.situation | FieldType.reaction | FieldType.offer,
  choiceId: number,
};

type OpportunityChoice = {
  type: FieldType.opportunity
  resources?: Resources;
};

type IncidentChoice = {
  id: number;
  type: FieldType.incident
}

export type Start = {
  type: FieldType.start;
}

export type Incident = Default & {
  type: FieldType.incident;
  action: Action;
}

export type Situation = Default & Choices & {
  type: FieldType.situation;
}

export type Reaction = Default & Choices & {
  type: FieldType.reaction;
}

export type Offer = Default & Choices & {
  type: FieldType.offer;
}

export type Opportunity = Default & {
  type: FieldType.opportunity;
}

export type Dream = Default & Choices & {
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

export type Action = {
  less?: Resources;
  more?: Resources;
  result: {
    move?: FieldType;
    resources?: Resources;
    hold?: number;
    gameover?: true;
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
  [key: number]: ({
    card: Fields
  } | {});
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
      return { card: FIELDS[FieldType.opportunity]![0] }
    }

  }
});
