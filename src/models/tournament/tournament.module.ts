import { Module } from '@nestjs/common';
import { TournamentResolver } from './tournament.resolver';
import { TournamentService } from './tournament.service';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { Tournament } from './entities/tournament.entity';

@Module({
  imports: [ConfigModule, TypegooseModule.forFeature([Tournament])],
  providers: [TournamentResolver, TournamentService]
})
export class TournamentModule {}
