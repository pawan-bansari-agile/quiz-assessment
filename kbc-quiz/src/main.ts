import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QuizSeeder } from './quiz/quiz.seeder/quiz.seeder';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const options = new DocumentBuilder()
    .setTitle('Quiz API')
    .setDescription('API documentation for the Quiz application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const seeder = app.get(QuizSeeder);
  await seeder.seed();
  await app.listen(3000);
}
bootstrap();
