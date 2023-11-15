import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;
    const now = Date.now();

    console.log(`[REQ]: ${path} ${new Date().toLocaleString()}`);

    return next.handle().pipe(
      tap(() => {
        console.log(
          `[RES]: ${path} ${new Date().toLocaleString()} ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
