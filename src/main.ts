import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const configService = app.get(ConfigService);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Cars API')
    .setDescription('API documentation for classic car marketplace (unsold, sold, details, etc.)')
    .setVersion('1.0')
    .addTag('cars')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger available at http://localhost:${port}/api-docs`);
}
bootstrap();