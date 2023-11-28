import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './common/interceptors/log.interceptor';
import { SocketIoAdapter } from './adapters/socket.io.adapter';
import * as cookesParser from 'cookie-parser';
import { logger } from './utils/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useGlobalInterceptors(new LogInterceptor());
  app.enableCors();
  app.use(cookesParser());
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
