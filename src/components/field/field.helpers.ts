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

export const FIELD_DICTIONARY = {
  [FieldType.situation]: 'Ситуация',
  [FieldType.incident]: 'Случай',
  [FieldType.offer]: 'Предложение',
  [FieldType.reaction]: 'Реакция',
  [FieldType.opportunity]: 'Возможность',
  [FieldType.dream]: 'Мечта-тест',
  [FieldType.activity]: 'Активность',
  [FieldType.problem]: 'Проблема',
};

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
  type: FieldType.situation | FieldType.reaction | FieldType.offer | FieldType.dream,
  choiceId: number,
};

export const OPTION_CHOICES = [1, 4, 3, 6];

type OpportunityChoice = {
  type: FieldType.opportunity
  outer: boolean;
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

export type Resources = Partial<Record<ResourceType, number>>;

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
export const INNER_FIELDS = {
  [FieldType.offer]: OFFERS_FIELDS,
  [FieldType.situation]: SITUATIONS_FIELDS,
  [FieldType.incident]: INCIDENTS_FIELDS,
  [FieldType.opportunity]: OPPORTUNITIES_FIELDS,
  [FieldType.reaction]: REACTION_FIELDS,
};

export const OUTER_FIELDS_COUNT = 30;
const PROBLEM_FIELDS = {
  0: 10,
  4: 5,
  10: 10,
  14: 5,
  18: 5,
  22: 10,
  26: 5,
};
const ACTIVITY_FIELDS = {
  1: 10,
  3: 10,
  5: 20,
  7: 20,
  9: 20,
  11: 15,
  13: 10,
  15: 10,
  17: 15,
  19: 15,
  21: 15,
  23: 25,
  25: 10,
  27: 20,
  29: 10,
};
export const DREAM_FIELDS = {
  2: 50,
  6: 100,
  8: 50,
  12: 100,
  16: 50,
  20: 50,
  24: 50,
  28: 100,
};

export const FROM_INNER_TO_OUTER = {
  3: 4,
  11: 16,
  16: 25,
};

type InnerFieldDictionary = Record<number, {
  card: Fields
} | {}>

const arrRand = <T>(array: T[]): T => {
  const random = Math.floor(Math.random() * array.length);

  return array[random];
};

export const InnerFieldDictionary = new Proxy<InnerFieldDictionary>({}, {
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
type OuterFieldDictionary = (dream: number, white: number) => Record<number, ({ card: Dream } | null | number)>
export const OuterFieldDictionary: OuterFieldDictionary = (dream, white) => new Proxy({}, {
  get: (target, p: string | number) => {
    const position = Number(`${p}`);

    if (Object.keys(DREAM_FIELDS).includes(String(position))) {
      if (position === dream && white >= DREAM_FIELDS[position]) return null;
      return { card: arrRand(FIELDS[FieldType.dream]) };
    }

    if (Object.keys(PROBLEM_FIELDS).includes(String(position))) {
      return -PROBLEM_FIELDS[position]
    }

    if (Object.keys(ACTIVITY_FIELDS).includes(String(position))) {
      return ACTIVITY_FIELDS[position]
    }
  }
});
