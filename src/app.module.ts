import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SimpleModule } from './simple/simple.module';
import { CategoryModule } from './category/category.module';
import { AddressModule } from './address/address.module';
import { CourierModule } from './courier/courier.module';
import { MerchantModule } from './merchant/merchant.module';

@Module({
  imports: [
    CommonModule,
    SimpleModule,
    UserModule,
    CourierModule,
    MerchantModule,
    AddressModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
