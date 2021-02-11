import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { TypegooseModule } from 'nestjs-typegoose';
import { Game } from 'src/game/entities/game.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Game]),
    UserModule,
  ],
  providers: [GameResolver, GameService],
})
export class GameModule {}
