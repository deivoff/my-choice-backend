import { Controller, Get, Param, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GameSessionService } from 'src/models/game/game-session/game-session.service';
import { GAME_NOT_FOUND } from 'src/models/game/game.errors';
import { GameStatus } from 'src/models/game/game-session/game-session.entity';

type Opengraph = {
  url: string;
  graph: {
    title?: string;
    description: string;
    publishedTime?: number;
  }
}

const GAME_STATUS: { [key in GameStatus]: [string, string] } = {
  [GameStatus.InProgress]: ['В процессе', 'Но вы можете посмотреть как она проходит!'],
  [GameStatus.ChoiceDream]: ['В процессе', 'Но вы можете посмотреть как она проходит!'],
  [GameStatus.Awaiting]: ['Ожидает игроков', 'Присоединяйтесь, скоро она начнется!'],
  [GameStatus.Finished]: ['Завершена', 'Начните новую игру прямо сейчас!'],
};

@Controller()
export class GameController {
  constructor(
    private readonly configService: ConfigService,
    private readonly gameSessionService: GameSessionService,
  ) {}

  @Get('*')
  @Render('opengraph.pug')
  getOpenGraph(): Opengraph {
    const url = this.configService.get<string>('origin.http')!;
    const publishedTime = Date.now();

    return {
      url,
      graph: {
        description: 'Игра "Мой выбор" - для всех, кто активно участвует в жизни школы, суза, вуза и, конечно же, города! Для волонтёров, участников общественных организаций, сообществ и объединений, а также для представителей социальных профессий!',
        publishedTime,
      }
    }
  }

  @Get('game/:id')
  @Render('opengraph.pug')
  async getGameOpenGraph(
    @Param() params: { id: string },
  ): Promise<Opengraph> {
    const url = this.configService.get<string>('origin.http')!;
    const publishedTime = Date.now();

    try {
      const activeGame = await this.gameSessionService.findOne(params.id);

      if (!activeGame) throw Error(GAME_NOT_FOUND);
      const [statusTitle, description] = GAME_STATUS[activeGame.status];

      const title = `Игра "${activeGame.name}" - ${statusTitle}`;

      return {
        url,
        graph: {
          title,
          description,
          publishedTime,
        }
      }
    } catch (e) {
      const title = 'Игра не найдена';
      const description = 'Начните новую игру прямо сейчас!';

      return {
        url,
        graph: {
          title,
          description,
          publishedTime,
        }
      }
    }
  }
}
