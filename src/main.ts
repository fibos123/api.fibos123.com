import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = 8080;
  console.log('App listening on port', port);
  await app.listen(port);
}
bootstrap();
