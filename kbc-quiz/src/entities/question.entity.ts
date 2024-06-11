// question.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Question {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'question asked' })
  @Column()
  question: string;

  @ApiProperty({ example: 'A,B,C,D' })
  @Column('simple-array')
  options: string[];

  @ApiProperty({ example: 'correct answer' })
  @Column()
  correctAnswer: string;

  @ApiProperty({ example: 'hint' })
  @Column()
  hint: string;
}
