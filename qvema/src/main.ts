// 1. Configuration globale (main.ts)
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration globale de la validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Lève une exception si des propriétés non décorées sont envoyées
      transform: true, // Transforme automatiquement les payloads
    }),
  );

  // Configuration du préfixe global pour les routes API
  app.setGlobalPrefix('api');

  // Configuration CORS
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
