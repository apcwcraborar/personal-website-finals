import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let app: any;

export default async (req: any, res: any) => {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: false,
    });

    const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    app.enableCors({
      origin: [frontendOrigin],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.setGlobalPrefix('api', {
      exclude: ['/'],
    });
    await app.init();
  }

  const server = app.getHttpAdapter().getInstance();
  server(req, res);
};
