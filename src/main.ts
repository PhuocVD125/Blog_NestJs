import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


    // Đăng ký bộ lọc xử lý lỗi HTTP
  app.useGlobalFilters(new HttpExceptionFilter());

    // Đăng ký bộ lọc xử lý tất cả các ngoại lệ
  app.useGlobalFilters(new AllExceptionsFilter());

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
