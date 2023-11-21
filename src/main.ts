import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './common/interceptors/log.interceptor';
import { SocketIoAdapter } from './adapters/socket.io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useGlobalInterceptors(new LogInterceptor());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
