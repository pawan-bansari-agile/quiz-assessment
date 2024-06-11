import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameTaskService } from './gameTask.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { GameTaskScheduler } from './gameTask.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), ScheduleModule.forRoot()],
  providers: [GameTaskService, GameTaskScheduler],
})
export class GameTaskModule {}
