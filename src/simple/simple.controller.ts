import { Controller, Get, HttpCode } from '@nestjs/common';
import { SimpleService } from './simple.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Test Connections')
@Controller('/test')
export class SimpleController {
  constructor(private simpleService: SimpleService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Test connection API' })
  getHello(): string {
    const result = this.simpleService.textHello();
    return result;
  }
}
