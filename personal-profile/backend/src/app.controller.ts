import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'Personal Website Guestbook API',
      status: 'running',
      endpoints: {
        health: '/api/health',
        entries: '/api/entries',
      },
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      time: new Date().toISOString(),
    };
  }
}
