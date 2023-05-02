import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';
import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { AllExceptionFilter } from '@common/filters';

import { AppModule } from '@app.module';

async function bootstrap() {
  const logger: Logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.use(I18nMiddleware);

  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('***');
  const origin = configService.get<string>('***');

  app.use(cookieParser());
  app.useLogger(logger);
  app.enableCors({ origin: [origin], credentials: true });

  const config = new DocumentBuilder()
    .setTitle('***')
    .setDescription('***')
    .setVersion('***')
    .addGlobalParameters({
      name: '***',
      in: '***',
      required: false,
      example: '***',
      description:
        '***'
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  await app.listen(port, async () => {
    logger.log(`Server started on port: ${port}`, NestApplication.name);
  });
}

void bootstrap();
