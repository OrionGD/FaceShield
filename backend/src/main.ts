import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthContextInterceptor } from './common/interceptors/auth-context.interceptor';
import { TenantContextInterceptor } from './common/interceptors/tenant-context.interceptor';

// Patch BigInt serialization support for JSON.stringify (used by Express / NestJS response serialization)
(BigInt.prototype as any).toJSON = function () {
  const num = Number(this);
  return Number.isSafeInteger(num) ? num : this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security & Request Bypass
  app.use(helmet());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  // Intercept and resolve /favicon.ico requests gracefully with 204 No Content
  // Also handle root health check for Render.com (probes GET / and HEAD /)
  app.use((req: any, res: any, next: any) => {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).end();
      return;
    }
    if (req.originalUrl === '/' && (req.method === 'GET' || req.method === 'HEAD')) {
      res.status(200).json({
        status: 'ok',
        service: 'FaceShield EdgeAI Backend',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next();
  });

  app.enableCors({
    origin: ['http://localhost:2345', 'http://127.0.0.1:2345', 'https://faceshield-edgeai.vercel.app'], // Frontend origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Filters & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new AuthContextInterceptor(),
    new TenantContextInterceptor(),
  );
  
  // API Versioning
  app.setGlobalPrefix('api/v1');

  // Swagger OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('FaceShield API')
    .setDescription('The Biometric Workforce Intelligence Enterprise API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3456, '0.0.0.0');
}
bootstrap();
