import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SimpleModule } from './simple/simple.module';
import { CategoryModule } from './category/category.module';
import { AddressModule } from './address/address.module';
import { CourierModule } from './courier/courier.module';
import { MerchantModule } from './merchant/merchant.module';
import { ProductModule } from './product/product.module';
import { PromoModule } from './promo/promo.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

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
    PromoModule,
    // ? cart module
    CartModule,
    CartModule,
    // ! order module
    OrderModule,
    // ! payment module
    // ! notification module
    // ! messagging module
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
