import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { Game, GameStatus } from '../entities/game.entity';
import { Question } from '../entities/question.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  private getPrizeLevels() {
    return [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
  }

  private getCurrentPrizeIndex(currentLevel: number) {
    return currentLevel - 1;
  }

  // Helper function to determine prize money based on level
  private getPrizeMoney(level: number): number {
    const prizeLevels = this.getPrizeLevels();
    return prizeLevels[level - 1] || 0;
  }

  private async getRandomQuestion(game: Game) {
    const questionsInGame = game.askedQuestions.map((q) => q.id);
    const question = await this.questionRepository
      .createQueryBuilder()
      .where({ id: Not(In(questionsInGame)) })
      .orderBy('RANDOM()')
      .getOne();

    if (!question) throw new Error('No more questions available');

    return question;
  }

  private sanitizeQuestion(question: Question): Partial<Question> {
    const { id, question: text, options } = question;
    // return sanitizedQuestion;
    return { id, question: text, options };
  }

  async createPlayer(displayName: string): Promise<Player> {
    const player = this.playerRepository.create({
      displayName,
      prizeMoney: 0,
      startTime: new Date(),
    });
    return await this.playerRepository.save(player);
  }

  async startGame(playerId: number) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });
    if (!player) {
      return 'Enter a player name first';
    }

    const game = this.gameRepository.create({
      player,
      currentLevel: 1,
      lifeline50Used: false,
      lifelineAIUsed: false,
      status: GameStatus.IN_PROGRESS,
      askedQuestions: [],
    });
    await this.gameRepository.save(game);
    const question = await this.getNextQuestion(game.id); // Retrieve the first question
    await this.attachQuestionToGame(game, question);
    const sanitizedGame = {
      ...game,
      askedQuestions: game.askedQuestions.map((q) => this.sanitizeQuestion(q)),
    };
    delete sanitizedGame.currentQuestion;
    return {
      game: sanitizedGame,
      prizeLevels: this.getPrizeLevels(),
      currentPrizeLevel: this.getCurrentPrizeIndex(1),
    };
  }

  async getNextQuestion(gameId: number) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['askedQuestions'],
    });
    if (!game) throw new Error('Game not found');

    const nextQuestion = await this.getRandomQuestion(game);
    await this.attachQuestionToGame(game, nextQuestion);
    await this.gameRepository.save(game);
    return nextQuestion;
  }

  private async attachQuestionToGame(game: Game, question: Question) {
    game.currentQuestion = question;
    game.askedQuestions.push(question);
    await this.gameRepository.save(game);
  }

  async answerQuestion(gameId: number, answer: string) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['currentQuestion', 'player', 'askedQuestions'],
    });
    if (!game) throw new Error('Game not found');

    const currentQuestion = game.currentQuestion;
    if (!currentQuestion) throw new Error('Question not found');

    const isAnswerCorrect = currentQuestion.correctAnswer === answer;
    const correctAnswer = currentQuestion.correctAnswer;
    if (isAnswerCorrect) {
      game.currentLevel++;

      if (game.currentLevel >= 10) {
        game.status = GameStatus.COMPLETED;
        game.player.prizeMoney = this.getPrizeMoney(game.currentLevel - 1);
        await this.playerRepository.save(game.player);
        await this.gameRepository.save(game);
        return {
          correct: true,
          message: `Congratulations! You have won Rs ${game.player.prizeMoney}.`,
          prizeMoney: game.player.prizeMoney,
          prizeLevels: this.getPrizeLevels(),
          currentPrizeLevel: this.getCurrentPrizeIndex(game.currentLevel),
          correctAnswer: correctAnswer,
        };
      } else {
        game.player.prizeMoney = this.getPrizeMoney(game.currentLevel);
        let nextQuestion;
        try {
          nextQuestion = await this.getRandomQuestion(game);
        } catch (error) {
          game.status = GameStatus.COMPLETED;
          await this.playerRepository.save(game.player);
          await this.gameRepository.save(game);
          return {
            correct: true,
            message: `Congratulations! You have won Rs ${game.player.prizeMoney}.`,
            prizeMoney: game.player.prizeMoney,
            prizeLevels: this.getPrizeLevels(),
            currentPrizeLevel: this.getCurrentPrizeIndex(game.currentLevel),
            correctAnswer: correctAnswer,
          };
        }
        await this.attachQuestionToGame(game, nextQuestion);
        await this.gameRepository.save(game);
        return {
          correct: true,
          nextQuestion: this.sanitizeQuestion(nextQuestion),
          prizeMoney: game.player.prizeMoney,
          prizeLevels: this.getPrizeLevels(),
          currentPrizeIndex: this.getCurrentPrizeIndex(game.currentLevel),
          correctAnswer: correctAnswer,
        };
      }
    } else {
      let prizeMoney = 0;
      if (game.currentLevel > 7) {
        prizeMoney = this.getPrizeMoney(7); // Milestone prize for level 4
      } else if (game.currentLevel > 4) {
        prizeMoney = this.getPrizeMoney(4);
      }
      game.player.prizeMoney = prizeMoney;
      game.status = GameStatus.COMPLETED;
      await this.playerRepository.save(game.player);
      await this.gameRepository.save(game);
      return {
        correct: false,
        message: `Incorrect answer. You have won Rs ${game.player.prizeMoney}.`,
        prizeMoney: game.player.prizeMoney,
        prizeLevels: this.getPrizeLevels(),
        currentPrizeIndex: this.getCurrentPrizeIndex(game.currentLevel),
        correctAnswer: correctAnswer,
      };
    }
  }

  async useLifeline50(
    gameId: number,
  ): Promise<{ remainingOptions: string[]; message: string }> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['currentQuestion'],
    });
    if (!game || game.lifeline50Used) {
      return {
        remainingOptions: [],
        message: `Lifeline 50-50 already used!`,
      };
    }
    const currentQuestion = game.currentQuestion;
    const correctOption = currentQuestion.correctAnswer;
    const incorrectOptions = currentQuestion.options.filter(
      (option) => option !== correctOption,
    );

    game.lifeline50Used = true;
    await this.gameRepository.save(game);

    return {
      remainingOptions: [
        correctOption,
        incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)],
      ],
      message: '',
    };
  }

  async useAskTheAI(
    gameId: number,
  ): Promise<{ hint: string; message: string }> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['currentQuestion'],
    });
    if (!game || game.lifelineAIUsed) {
      return {
        hint: '',
        message: 'Lifeline AskTheAI already used!',
      };
    }
    const currentQuestion = game.currentQuestion;

    game.lifelineAIUsed = true;
    await this.gameRepository.save(game);

    return { hint: currentQuestion.hint, message: '' };
  }

  async quitGame(
    gameId: number,
  ): Promise<{ message: string; prizeMoney: number }> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['player'],
    });
    if (!game) throw new Error('Game not found');

    if (game.currentLevel < 5) {
      return {
        prizeMoney: 0,
        message: 'You cannot quit before level 4 (Rs 1000).',
      };
    }

    const prizeMoney = this.getPrizeMoney(game.currentLevel - 1);
    game.player.prizeMoney = prizeMoney;
    game.status = GameStatus.COMPLETED;
    await this.playerRepository.save(game.player);
    await this.gameRepository.save(game);

    return {
      message: `You have quit the game. You won Rs ${game.player.prizeMoney}.`,
      prizeMoney: game.player.prizeMoney,
    };
  }

  async getLeaderboard() {
    const players = await this.playerRepository.find({
      order: { prizeMoney: 'DESC', startTime: 'ASC' },
      // take: 10,
      relations: ['games'],
    });

    const leaderboard = await Promise.all(
      players.map(async (player) => {
        if (player.games) {
          const status = await this.getStatusLabel(player.games[0].id);
          return {
            displayName: player.displayName,
            prizeMoney: player.prizeMoney,
            startTime: player.startTime,
            status: status,
            message: '',
          };
        } else {
          return {
            message: 'no games found to display',
          };
        }
      }),
    );

    return leaderboard;
  }

  private async getStatusLabel(gameId: number): Promise<string> {
    const status = await this.gameRepository.findOne({ where: { id: gameId } });
    return status.status;
  }

  async getGame(gameId: number): Promise<Game> {
    return this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['player', 'currentQuestion', 'askedQuestions'],
    });
  }

  async markIncomplete(gameId: number): Promise<void> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new Error('Game not found');
    }

    game.status = GameStatus.INCOMPLETE; // Mark as incomplete
    await this.gameRepository.save(game);
  }
}
