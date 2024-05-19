import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.enableCors();

  // set up middlewares ----------------------------
  app.use(morgan('dev'));
  app.use(cookieParser());

  // -----------------------------------------------
  // set up global pipes to protect data from all endpoint ---------------------------
  // app.useGlobalPipes(new ValidationPipe());

  // Configure the class-validator and class-transformer libraries to use the NestJS dependency injection container.
  // This allows these libraries to access services that are managed by NestJS.
  // The 'fallbackOnErrors' option is set to true, which means that if a requested dependency is not found in the NestJS container,
  // these libraries will try to instantiate it themselves.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // set up swagger --------------------------------
  const config = new DocumentBuilder()
    .setTitle('API - Document - TogetherList')
    .setDescription('API for user interface development')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
    },
  });
  // http://localhost:8000/swagger#/
  // -----------------------------------------------

  await app.listen(8000, '0.0.0.0');
}

bootstrap();
