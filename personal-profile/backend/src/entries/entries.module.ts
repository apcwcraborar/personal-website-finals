import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { SupabaseService } from '../common/services/supabase.service';
import { TokenService } from '../common/services/token.service';

@Module({
  controllers: [EntriesController],
  providers: [EntriesService, SupabaseService, TokenService],
})
export class EntriesModule {}
