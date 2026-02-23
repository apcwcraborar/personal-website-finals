import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

@Injectable()
export class EntriesService {
  constructor(private supabaseService: SupabaseService) {}

  async getEntries() {
    return this.supabaseService.getEntries();
  }

  async createEntry(name: string, message: string) {
    const trimmedName = String(name || '').trim();
    const trimmedMessage = String(message || '').trim();

    if (!trimmedName || !trimmedMessage) {
      throw new BadRequestException('Name and message are required');
    }

    return this.supabaseService.createEntry(trimmedName, trimmedMessage);
  }
}
