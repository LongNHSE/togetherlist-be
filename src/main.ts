import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.enableCors();

  // set up middlewares ----------------------------
  app.use(morgan('dev'));
  // -----------------------------------------------

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
    }
  });
  // http://localhost:8000/swagger#/
  // -----------------------------------------------

  await app.listen(8000, '0.0.0.0');
  await app.listen(8000);
  app.use(cookieParser());
}

bootstrap();