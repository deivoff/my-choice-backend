export enum OpportunityCardType {
  tryYourLuck,
  darkFail,
  resourcesFail,
  success,
}

const OPPORTUNITY_MESSAGES = {
  [OpportunityCardType.tryYourLuck]: 'К сожалению, Вам не хватает одного из ресурсов, бросьте кубик, чтобы испытать свои силы.',
  [OpportunityCardType.darkFail]: 'У Вас есть СК (Ч), Вы не можете перейти на внешний круг',
  [OpportunityCardType.resourcesFail]: 'К сожалению, Вам не хватает ресурсов.',
  [OpportunityCardType.success]: 'Поздравляю! Вы переходите на внешний круг.',
};

const DEFAULT_MESSAGE = 'Если количество ресурсов позволяет перейти на «внешний круг» (10 Ж и 10 СК(Б) или 15 Ж и 100₽), а также у вас нет СК(Ч) – то вы переходите.';
export function getOpportunityDescription(type: OpportunityCardType): string {
  return DEFAULT_MESSAGE + '\n\n' + OPPORTUNITY_MESSAGES[type];
}
