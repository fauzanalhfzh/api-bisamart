import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SimpleService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  textHello(): string {
    this.logger.debug(`SimpleService.getHello`);
    return 'Hello API';
  }
}
