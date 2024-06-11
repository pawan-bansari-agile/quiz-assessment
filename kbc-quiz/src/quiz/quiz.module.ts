import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizSeeder } from './quiz.seeder/quiz.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Player } from '../entities/player.entity';
import { Game } from '../entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Player, Game])],
  providers: [QuizService, QuizSeeder],
  controllers: [QuizController],
})
export class QuizModule {}
