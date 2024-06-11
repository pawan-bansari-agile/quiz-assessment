import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameTaskService } from './gameTask.service';

@Injectable()
export class GameTaskScheduler {
  constructor(private readonly gameTaskService: GameTaskService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    console.log('Running markIncompleteGames cron job');
    await this.gameTaskService.markIncompleteGames();
  }
}
