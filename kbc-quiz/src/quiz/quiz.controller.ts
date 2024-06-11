// quiz.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { MarkIncompleteDto } from 'src/dtos/maerIncomplete.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePlayerDto } from 'src/dtos/create-player.dto';
import { Game } from 'src/entities/game.entity';
import { AnswerQuestionDto } from 'src/dtos/answer-question.dto';
import { Player } from 'src/entities/player.entity';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiOperation({ summary: 'Create a new player' })
  @ApiResponse({
    status: 201,
    type: Player,
  })
  @ApiBody({ type: CreatePlayerDto })
  @Post('player')
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.quizService.createPlayer(createPlayerDto.displayName);
  }

  @ApiOperation({ summary: 'Start a new game for a player' })
  @ApiResponse({
    status: 201,
    type: Game,
  })
  @ApiParam({ name: 'playerId', example: 1 })
  @Post('game/:playerId')
  async startGame(@Param('playerId') playerId: number) {
    return this.quizService.startGame(playerId);
  }

  @Post('game/:gameId/answer')
  @ApiOperation({ summary: 'answer the asked question' })
  @ApiParam({ name: 'gameId', example: 1 })
  @ApiBody({ type: AnswerQuestionDto })
  @ApiResponse({ status: 200, type: Game })
  async answerQuestion(
    @Param('gameId') gameId: number,
    @Body() answerQuestionDto: AnswerQuestionDto,
  ) {
    return this.quizService.answerQuestion(gameId, answerQuestionDto.answer);
  }

  @Post('game/:gameId/lifeline/50-50')
  @ApiOperation({ summary: 'Use 50-50 lifeline' })
  @ApiParam({ name: 'gameId', example: 1 })
  @ApiResponse({ status: 200 })
  async useLifeline50(@Param('gameId') gameId: number) {
    return this.quizService.useLifeline50(gameId);
  }

  @Post('game/:gameId/lifeline/ask-the-ai')
  @ApiOperation({ summary: 'Use Ask the AI lifeline' })
  @ApiParam({ name: 'gameId', example: 1 })
  @ApiResponse({ status: 200 })
  async useAskTheAI(@Param('gameId') gameId: number) {
    return this.quizService.useAskTheAI(gameId);
  }

  @Post('game/:gameId/quit')
  @ApiOperation({ summary: 'Quit the game' })
  @ApiParam({ name: 'gameId', example: 1 })
  @ApiResponse({ status: 200 })
  async quitGame(@Param('gameId') gameId: number) {
    return this.quizService.quitGame(gameId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get the leaderboard' })
  @ApiResponse({ status: 200 })
  async getLeaderboard() {
    return this.quizService.getLeaderboard();
  }

  @Get('game/:gameId')
  @ApiOperation({ summary: 'Get game details' })
  @ApiParam({ name: 'gameId', example: 1 })
  @ApiResponse({ status: 200, type: Game })
  async getGame(@Param('gameId') gameId: number) {
    return this.quizService.getGame(gameId);
  }

  @Post('mark-incomplete')
  @ApiOperation({ summary: 'Mark a game as incomplete' })
  @ApiBody({ type: MarkIncompleteDto })
  @ApiResponse({ status: 204 })
  async markIncomplete(
    @Body() markIncompleteDto: MarkIncompleteDto,
  ): Promise<void> {
    await this.quizService.markIncomplete(markIncompleteDto.gameId);
  }
}
