import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class HttpToSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    client.emit('exception', {
      data: exception.getResponse(),
      status: exception.getStatus(),
      message: exception.message,
    });
  }
}
