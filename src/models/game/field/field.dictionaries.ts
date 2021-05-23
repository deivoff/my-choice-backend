import { registerEnumType } from '@nestjs/graphql';
import { PlayerPosition } from 'src/models/game/player/player.entity';

export enum FieldType {
  Start = 'Start',
  Situation = 'Situation',
  Incident = 'Incident',
  Offer = 'Offer',
  Reaction = 'Reaction',
  Opportunity = 'Opportunity',
  Dream = 'Dream',
  Activity = 'Activity',
  Problem = 'Problem'
}

registerEnumType(FieldType, {
  name: 'FieldType',
});

export const FIELD_DICTIONARY = {
  [FieldType.Situation]: 'Ситуация',
  [FieldType.Incident]: 'Случай',
  [FieldType.Offer]: 'Предложение',
  [FieldType.Reaction]: 'Реакция',
  [FieldType.Opportunity]: 'Возможность',
  [FieldType.Dream]: 'Мечта-тест',
  [FieldType.Activity]: 'Активность',
  [FieldType.Problem]: 'Проблема',
};

const INNER_FIELDS_COUNT = 20;
const OUTER_FIELDS_COUNT = 30;

export const FIELDS_COUNT = {
  [PlayerPosition.Inner]: INNER_FIELDS_COUNT,
  [PlayerPosition.Outer]: OUTER_FIELDS_COUNT,
};


const OFFERS_FIELDS = [0, 4, 8, 12, 17];
const SITUATIONS_FIELDS = [1, 7, 9, 13, 18];
const INCIDENTS_FIELDS = [2, 6, 10, 15, 19];
const OPPORTUNITIES_FIELDS = [3, 11, 16];
const REACTION_FIELDS = [5, 14];
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

const DREAM_IDS = Object.keys(DREAM_FIELDS);
export const getRandomDream = (): number => {
  const id = DREAM_IDS[Math.floor(Math.random() * DREAM_IDS.length)];
  return Number(id);
};

const PROBLEM_FIELDS = {
  0: 10,
  4: 5,
  10: 10,
  14: 5,
  18: 5,
  22: 10,
  26: 5,
};

export const INNER_FIELD_DICT = {
  [FieldType.Offer]: OFFERS_FIELDS,
  [FieldType.Situation]: SITUATIONS_FIELDS,
  [FieldType.Incident]: INCIDENTS_FIELDS,
  [FieldType.Opportunity]: OPPORTUNITIES_FIELDS,
  [FieldType.Reaction]: REACTION_FIELDS,
};

export const INNER_FIELDS: [FieldType, number[]][] = [
  [FieldType.Offer, OFFERS_FIELDS],
  [FieldType.Situation, SITUATIONS_FIELDS],
  [FieldType.Incident, INCIDENTS_FIELDS],
  [FieldType.Opportunity, OPPORTUNITIES_FIELDS],
  [FieldType.Reaction, REACTION_FIELDS],
];

export const OUTER_FIELDS: [FieldType, Record<number, number>][] = [
  [FieldType.Problem, PROBLEM_FIELDS],
  [FieldType.Dream, DREAM_FIELDS],
  [FieldType.Activity, ACTIVITY_FIELDS],
];



export const FROM_INNER_TO_OUTER = {
  3: 4,
  11: 16,
  16: 25,
};
