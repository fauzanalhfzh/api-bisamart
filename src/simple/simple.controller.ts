import { Controller, Get, HttpCode } from '@nestjs/common';
import { SimpleService } from './simple.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/test')
export class SimpleController {
  constructor(private simpleService: SimpleService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Test connect API' })
  getHello(): string {
    const result = this.simpleService.textHello();
    return result;
  }
}
