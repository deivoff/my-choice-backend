import { Moderator } from './moderator.entity';
import { Player } from './player.entity';

export * from './moderator.entity';
export * from './player.entity';

const moderators = {
  'a?hQa&uu29PCO#pE': 'Модератор#1',
  'Y5Ee5MA3FI$v9bFo': 'Модератор#2',
  'Yx#q5xQ|-Zq5+kim': 'Модератор#3',
};

export function createUser(username) {
  if (Object.keys(moderators).includes(username)) {
    return new Moderator(moderators[username]);
  }

  return new Player(username);
}
