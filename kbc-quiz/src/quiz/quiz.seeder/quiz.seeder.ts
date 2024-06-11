import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';

@Injectable()
export class QuizSeeder {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async seed() {
    const existingQuestions = await this.questionRepository.find();
    if (existingQuestions.length === 0) {
      const questions = [
        {
          question: 'What is 2+7?',
          options: ['3', '7', '9', '11'],
          correctAnswer: '9',
          hint: 'what comes after 8',
        },
        {
          question: 'What is 5x15?',
          options: ['25', '50', '75', '100'],
          correctAnswer: '75',
          hint: 'what is 70 + 5',
        },
        {
          question: 'What is 6x9?',
          options: ['54', '36', '24', '69'],
          correctAnswer: '54',
          hint: 'what is 50 + 4',
        },
        {
          question: 'What is 0+0?',
          options: ['0', '1', '100', '1000'],
          correctAnswer: '0',
          hint: 'what comes before 1',
        },
        {
          question: 'How many alphabets are there in the word ‘apple’?',
          options: ['10', '15', '5', '7'],
          correctAnswer: '5',
          hint: 'what comes after 4',
        },
        {
          question: 'What is the colour of moon?',
          options: ['red', 'orange', 'pink', 'white'],
          correctAnswer: 'white',
          hint: 'like the colour of snow',
        },
        {
          question: 'How many legs does a chicken have?',
          options: ['1', '2', '4', '10'],
          correctAnswer: '2',
          hint: 'how many legs do you have?',
        },
        {
          question: 'Which one of these is not a programming language?',
          options: ['C', 'C++', 'Javascript', 'English'],
          correctAnswer: 'English',
          hint: 'Which language is used to ask this question',
        },
        {
          question: 'How many days are there in a week?',
          options: ['10', '5', '7', '6'],
          correctAnswer: '7',
          hint: 'what comes between 6 and 8',
        },
        {
          question: 'Which of these is not a react library inbuilt hook?',
          options: [
            'useState',
            'useRef',
            'useImperativeHandle',
            'useLocalStorage',
          ],
          correctAnswer: 'useLocalStorage',
          hint: 'something related to storage',
        },
      ];

      for (const question of questions) {
        await this.questionRepository.save(
          this.questionRepository.create(question),
        );
      }
      console.log('Questions seeded successfully.');
    } else {
      console.log('Questions already exist. Skipping seeding.');
    }
  }
}
