import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SimpleModule } from './simple/simple.module';

@Module({
  imports: [
    CommonModule,
    SimpleModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
