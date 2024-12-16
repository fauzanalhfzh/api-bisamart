import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SimpleModule } from './simple/simple.module';
import { DriverModule } from './driver/driver.module';
import { RidesModule } from './rides/rides.module';
import { MerchantModule } from './merchant/merchant.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    CommonModule,
    SimpleModule,
    UserModule,
    DriverModule,
    RidesModule,
    MerchantModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
