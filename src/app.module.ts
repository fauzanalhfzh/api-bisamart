import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SimpleModule } from './simple/simple.module';
import { DriverModule } from './courier/courier.module';
import { MerchantModule } from './merchant/merchant.module';
import { ProductModule } from './product/product.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    CommonModule,
    SimpleModule,
    UserModule,
    DriverModule,
    MerchantModule,
    ProductModule,
    AddressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
