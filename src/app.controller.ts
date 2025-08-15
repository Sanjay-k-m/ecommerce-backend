import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHelloDefault(): string {
    return 'Default version';
  }

  @Get()
  @Version('1')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Version('2')
  getHelloV2(): string {
    return 'Version 2';
  }
}
