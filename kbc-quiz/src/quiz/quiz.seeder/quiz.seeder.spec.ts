import { Test, TestingModule } from '@nestjs/testing';
import { QuizSeeder } from './quiz.seeder';

describe('QuizSeeder', () => {
  let provider: QuizSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizSeeder],
    }).compile();

    provider = module.get<QuizSeeder>(QuizSeeder);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
