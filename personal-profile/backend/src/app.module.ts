import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EntriesModule } from './entries/entries.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, EntriesModule],
  controllers: [AppController],
})
export class AppModule {}
