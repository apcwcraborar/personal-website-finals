import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && key) {
      this.client = createClient(url, key);
    }
  }

  private ensureClient() {
    if (!this.client) {
      throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
  }

  async getEntries() {
    this.ensureClient();
    const tableName = process.env.SUPABASE_GUESTBOOK_TABLE || 'guestbook';
    const { data, error } = await this.client!
      .from(tableName)
      .select('id,name,message,created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch entries: ${error.message}`);
    }

    return data || [];
  }

  async createEntry(name: string, message: string) {
    this.ensureClient();
    const tableName = process.env.SUPABASE_GUESTBOOK_TABLE || 'guestbook';
    const { data, error } = await this.client!
      .from(tableName)
      .insert([{ name, message }])
      .select();

    if (error) {
      throw new Error(`Failed to create entry: ${error.message}`);
    }

    return data?.[0] || null;
  }
}
