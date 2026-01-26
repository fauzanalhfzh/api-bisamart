import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';

@Injectable()
export class PaymentService {
    private snap: any;

    constructor(private configService: ConfigService) {
        this.snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: this.configService.get<string>('MIDTRANS_SERVER_KEY'),
            clientKey: this.configService.get<string>('MIDTRANS_CLIENT_KEY'),
        });
    }

    async createTransaction(parameter: any): Promise<any> {
        return this.snap.createTransaction(parameter);
    }
}
