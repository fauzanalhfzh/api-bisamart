import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Cart')
@Controller('/api/v1/users')
export class CartController {}