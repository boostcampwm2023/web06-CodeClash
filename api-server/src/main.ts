import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './adapters/socket.io.adapter';
import * as cookesParser from 'cookie-parser';
import { logger } from './utils/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookesParser());
  await app.listen(3000);
}
bootstrap();
