import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // buang field yang tidak terdaftar di DTO
      forbidNonWhitelisted: true, // lempar 400 kalau ada field asing
      transform: true, // ubah payload plain object jadi instance DTO + tipe data
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Todo API berjalan di: ${await app.getUrl()}`);
}
bootstrap();
