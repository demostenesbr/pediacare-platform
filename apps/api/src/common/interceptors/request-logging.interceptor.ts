import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();

    return next.handle().pipe(
      tap(() => {
        const payload = {
          level: 'info',
          type: 'http_request',
          method: (request as any).method,
          path: (request as any).url,
          durationMs: Date.now() - startedAt,
          timestamp: new Date().toISOString(),
        };

        console.log(JSON.stringify(payload));
      }),
    );
  }
}
