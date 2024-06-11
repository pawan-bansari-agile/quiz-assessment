import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Game } from './game.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Player {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Player 1' })
  @Column()
  displayName: string;

  @ApiProperty({ example: 10000 })
  @Column({ default: 0 })
  prizeMoney: number;

  @ApiProperty({ example: new Date() })
  @Column()
  startTime: Date;

  @ApiProperty({ type: () => [Game], isArray: true })
  @OneToMany(() => Game, (game) => game.player)
  games: Game[];
}
