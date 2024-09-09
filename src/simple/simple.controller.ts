import { Controller, Get, HttpCode } from '@nestjs/common';
import { SimpleService } from './simple.service';

@Controller('/test')
export class SimpleController {
  constructor(private simpleService: SimpleService) {}

  @Get()
  @HttpCode(200)
  getHello(): string {
    const result = this.simpleService.textHello();
    return result;
  }
}
