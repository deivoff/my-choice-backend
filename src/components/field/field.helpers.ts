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

export const INNER_FIELDS_COUNT = 20;
const OFFERS = [0, 4, 8, 12, 17];
const SITUATIONS = [1, 7, 9, 13, 18];
const INCIDENTS = [2, 6, 10, 15, 19];
const OPPORTUNITIES = [3, 11, 16];
const REACTION = [5, 14];

type FieldDictionary = {
  [key: number]: Field;
}
export const InnerFieldDictionary = new Proxy<FieldDictionary>({}, {
  get: (target, p: number) => {
    if (OFFERS.includes(p)) {
      return {
        type: FieldType.offer,
      }
    }

    if (SITUATIONS.includes(p)) {
      return {
        type: FieldType.situation,
      }
    }

    if (INCIDENTS.includes(p)) {
      return {
        type: FieldType.incident,
      }
    }

    if (OPPORTUNITIES.includes(p)) {
      return {
        type: FieldType.opportunity,
      }
    }

    if (REACTION.includes(p)) {
      return {
        type: FieldType.reaction,
      }
    }
  }
});
