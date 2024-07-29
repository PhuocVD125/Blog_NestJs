import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Viblo Blog')
  .setDescription("ListAPIS for Viblo Blog")
  .setVersion('1.0')
  .addTag('Auth')
  .addTag('Users')
  .addBearerAuth()
  .build();
  const doucument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doucument);
  await app.listen(3000);
}
bootstrap();
