import { Module } from '@nestjs/common';
import { SimpleService } from './simple.service';
import { SimpleController } from './simple.controller';

@Module({
  providers: [SimpleService],
  controllers: [SimpleController],
})
export class SimpleModule {}
