import { registerEnumType } from '@nestjs/graphql';

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
