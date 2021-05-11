import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/models/auth/auth.guard';
import { DecodedUser } from 'src/models/user/entities/user.entity';
import { TournamentService } from 'src/models/tournament/tournament.service';
import { Tournament } from 'src/models/tournament/entities/tournament.entity';

@Resolver()
export class TournamentResolver {
  constructor(private readonly tournamentService: TournamentService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Tournament)
  createTournament(
    @Args('name') name: string,
    @DecodedUser() { _id }: DecodedUser
  ) {
    return this.tournamentService.create(
      name,
      _id,
    );
  }

  @Query(() => [Tournament], { name: 'tournaments' })
  findAll() {
    return this.tournamentService.findAll();
  }

}
