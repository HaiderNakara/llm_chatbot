import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('LLM Chatbot API')
    .setDescription('The LLM Chatbot API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl() + '/api/docs'}`);

}
bootstrap();
