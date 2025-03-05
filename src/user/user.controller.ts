import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { ApiConsumes, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  ForgotPasswordRequest,
  LoginUserRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  UserResponse,
  VerifiedUserRequest,
} from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('/api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/auth/register')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Register new user' })
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);
    console.log(request);
    return {
      data: result,
    };
  }

  @Post('/auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login users' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }



  @Get('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get user data' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      data: result,
    };
  }

  @Patch('/auth/send-otp')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'send OTP user' })
  async verified(
    @Auth() user: User,
  ) {
    const result = await this.userService.sendOtp(user);
    return {
      data: result,
    };
  }
  
  @Post('/auth/verify-otp')
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Verifikasi OTP untuk user' })
  async verifyOtp(
    @Auth() user: User,
    @Body() request: VerifiedUserRequest,
    
  ) {
    const result = await this.userService.verifiedOtp(user, request);
    return {
      data: result
    }
  }

  @Post('/forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send email for forgot password' })
  async forgotPassword(@Body() request: ForgotPasswordRequest) {
    return this.userService.forgotPassword(request);
  }
  
  @Post('/reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() request: ResetPasswordRequest) {
    return this.userService.resetPassword(request);
  }


  @Patch('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update data users' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/auth/logout')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Logout users' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.userService.logout(user);
    return {
      data: true,
    };
  }
}
