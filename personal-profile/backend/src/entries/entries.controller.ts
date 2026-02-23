import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TokenService } from '../common/services/token.service';

@Controller('entries')
export class EntriesController {
  constructor(
    private entriesService: EntriesService,
    private tokenService: TokenService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getEntries() {
    return this.entriesService.getEntries();
  }

  @Post()
  @UseGuards(AuthGuard)
  async createEntry(@Body() payload: { name: string; message: string }) {
    return this.entriesService.createEntry(payload.name, payload.message);
  }
}
