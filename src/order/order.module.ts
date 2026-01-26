import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule { }
