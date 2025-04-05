import { Module } from "@nestjs/common";
import { CouponService } from "./promo.service";
import { CouponController } from "./promo.controller";

@Module({
    providers: [CouponService],
    controllers: [CouponController]
})
export class CouponModule {}