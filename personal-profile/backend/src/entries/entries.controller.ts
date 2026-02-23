import { Controller, Get, Post, Body } from '@nestjs/common';
import { EntriesService } from './entries.service';

@Controller('entries')
export class EntriesController {
  constructor(private entriesService: EntriesService) {}

  @Get()
  async getEntries() {
    return this.entriesService.getEntries();
  }

  @Post()
  async createEntry(@Body() payload: { name: string; message: string }) {
    return this.entriesService.createEntry(payload.name, payload.message);
  }
}
