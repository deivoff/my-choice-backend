import { Injectable, Scope } from '@nestjs/common'
import { OrderedNestDataLoader } from 'src/dataloader';
import { UserService } from 'src/models/user/user.service';
import { User } from 'src/models/user/entities/user.entity';
import { objectIdToString } from 'src/common/scalars/objectId.scalar';

@Injectable({ scope: Scope.REQUEST })
export class UserLoader extends OrderedNestDataLoader<User['_id'], User> {
  constructor(private readonly userService: UserService) {
    super()
  }

  // @ts-ignore
  protected getOptions = () => ({
    propertyKey: '_id',
    query: (keys: Array<User['_id']>) => {
      return this.userService.findByIds(keys);
      },
    dataloaderConfig: { cacheKeyFn: objectIdToString }
  })

}
