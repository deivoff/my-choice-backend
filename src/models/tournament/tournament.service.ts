import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Tournament } from 'src/models/tournament/entities/tournament.entity';
import { ID } from 'src/common/scalars/objectId.scalar';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament) private readonly tournamentModel: ReturnModelType<typeof Tournament>
  ) {}

  create(
    name: string,
    creator: ID,
  ) {
    return this.tournamentModel.create({
      name,
      creator,
    })
  }

  findAll = () => {
    return this.tournamentModel.find().lean();
  };

  findOne = (_id: ID) => {
    return this.tournamentModel.findById(_id).lean();
  }

}
