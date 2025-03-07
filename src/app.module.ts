import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SimpleModule } from './simple/simple.module';
import { CategoryModule } from './category/category.module';
import { AddressModule } from './address/address.module';
import { CourierModule } from './courier/courier.module';

@Module({
  imports: [
    CommonModule,
    SimpleModule,
    UserModule,
    CourierModule,
    AddressModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
