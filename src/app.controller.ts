import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/query')
  createQuery(@Query('thread_id') threadId: string, @Body() data: any): any {
    return this.appService.createQuery(threadId, data);
  }

  @Get('/status')
  getQueryStatus(
    @Query('thread_id') threadId: string,
    @Query('run_id') runId: string,
  ): any {
    return this.appService.getRunStatus(threadId, runId);
  }

  @Get('/events')
  getEvents(@Query('thread_id') threadId: string): any {
    return this.appService.getEvents(threadId);
  }
}
