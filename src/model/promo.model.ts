import { ApiProperty } from "@nestjs/swagger";

export class CreatePromoRequest {
    @ApiProperty({ type: 'string', format: 'binary' })
    thumbnail: any;
    @ApiProperty({ example: "PROMO123"})
    code: string;
    @ApiProperty({ example: "PROMO APRIL MOP"})
    name: string;
    @ApiProperty({ example: 10000})
    discount_amount: number;
    @ApiProperty({ example: "2025-010-07 18:10:14.504"})
    expiration_date: Date;
    @ApiProperty({ example: 10})
    usage_limit: number;
}

export class PromoResponse {
    id: number;
    thumbnail: string;
    code: string;
    name: string;
    discount_amount: number;
    expiration_date: Date;
    usage_limit: number;
    created_at: Date;
    updated_at: Date;
}