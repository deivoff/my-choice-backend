import { User } from './user.entity';

export class Moderator extends User {
  canCreate = true;
}
