import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //middle ware to allow request from port 5000 which is our flutter application
  app.enableCors({
    origin: 'http://localhost:5000', // Replace with your frontend URL if different
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
