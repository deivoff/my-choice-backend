import { Injectable, Scope } from '@nestjs/common'
import { OrderedNestDataLoader } from 'src/dataloader';
import { objectIdToString } from 'src/common/scalars/objectId.scalar';
import { TournamentService } from 'src/models/tournament/tournament.service';
import { Tournament } from 'src/models/tournament/entities/tournament.entity';

@Injectable({ scope: Scope.REQUEST })
export class TournamentLoader extends OrderedNestDataLoader<Tournament['_id'], Tournament> {
  constructor(private readonly tournamentService: TournamentService) {
    super()
  }

  // @ts-ignore
  protected getOptions = () => ({
    propertyKey: '_id',
    query: (keys: Array<Tournament['_id']>) => {
      return this.tournamentService.findByIds(keys);
    },
    dataloaderConfig: { cacheKeyFn: objectIdToString }
  })

}
