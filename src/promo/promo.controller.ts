import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Coupun')
@Controller('/api/v1/coupon')
export class CouponController {}