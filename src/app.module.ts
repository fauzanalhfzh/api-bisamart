import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SimpleModule } from './simple/simple.module';
import { CategoryModule } from './category/category.module';
import { AddressModule } from './address/address.module';
import { CourierModule } from './courier/courier.module';
import { MerchantModule } from './merchant/merchant.module';
import { ProductModule } from './product/product.module';
import { CouponModule } from './promo/promo.module';

@Module({
  imports: [
    CommonModule,
    SimpleModule,
    UserModule,
    AddressModule,
    CourierModule,
    MerchantModule,
    ProductModule,
    CategoryModule,
    // ? coupon module
    CouponModule
    // ! cart module
    // ! order module
    // ! payment module
    // ! notification module
    // ! messagging module
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
