import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status-server')
  async getHello(): Promise<any> {
    return await this.appService.getHello();
  }

  @Get('status-ia')
  async getStatusIa(): Promise<any> {
    return await this.appService.statusServer();
  }
}
