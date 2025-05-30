import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppLogger } from './logger/app-logger.service';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger/setup';
import { stringToBool } from './utils/common/string-to-bool';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get<ConfigService>(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'api/v',
  });

  app.useGlobalPipes(new ValidationPipe());

  if (stringToBool(configService.get('SWAGGER_ENABLED'))) {
    setupSwagger(app);
  }

  app.useLogger(app.get(AppLogger));
  app.use(cookieParser());
  app.enableCors();

  const port = configService.get<number>('PORT');
  await app.listen(port ?? 3000);
}
bootstrap();
