// game.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Player } from './player.entity';
import { Question } from './question.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum GameStatus {
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  FORFEITED = 'Forfeited',
  INCOMPLETE = 'INCOMPLETE',
}

@Entity()
export class Game {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Player })
  @ManyToOne(() => Player, (player) => player.games)
  player: Player;

  @ApiProperty({ type: () => [Question], isArray: true })
  @ManyToMany(() => Question) // Add ManyToMany relation for asked questions
  @JoinTable()
  askedQuestions: Question[];

  @ApiProperty({ example: 9 })
  @Column({ default: 0 })
  currentLevel: number;

  @ApiProperty({ example: 'boolean' })
  @Column({ default: false })
  lifeline50Used: boolean;

  @ApiProperty({ example: 'boolean' })
  @Column({ default: false })
  lifelineAIUsed: boolean;

  @ApiProperty({ example: GameStatus })
  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.IN_PROGRESS,
  })
  status: GameStatus;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true }) // Add this line
  currentQuestionId: number; // Add this line

  @ApiProperty({ type: () => Question })
  @ManyToOne(() => Question)
  @JoinColumn({ name: 'currentQuestionId' })
  currentQuestion: Question;
}
