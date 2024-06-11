import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatus } from '../entities/game.entity';

@Injectable()
export class GameTaskService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async markIncompleteGames() {
    console.log('Fetching incomplete games');
    const incompleteGames = await this.gameRepository.find({
      where: { status: GameStatus.INCOMPLETE },
      relations: ['player'], // Ensure player is fetched as well
    });

    for (const game of incompleteGames) {
      console.log(`Marking game ${game.id} as forfeited`);
      game.status = GameStatus.FORFEITED;
      game.player.prizeMoney = 0;
      await this.gameRepository.save(game.player);
      await this.gameRepository.save(game);
    }
  }
}
