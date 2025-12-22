import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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
import { Response } from 'express';

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
  async verified(@Auth() user: User) {
    const result = await this.userService.sendOtp(user);
    return {
      data: result,
    };
  }

  @Post('/auth/verify-otp')
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Verifikasi OTP untuk user' })
  async verifyOtp(@Auth() user: User, @Body() request: VerifiedUserRequest) {
    const result = await this.userService.verifiedOtp(user, request);
    return {
      data: result,
    };
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

  @Get('/reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password page (UI)' })
  resetPasswordPage(
    @Query('token') token: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    if (!token || !email) {
      return res.status(400).send('Token atau email tidak valid');
    }

    return res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reset Password</title>
      <style>
        body {
          font-family: Arial;
          background: #f3f4f6;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .card {
          background: white;
          padding: 24px;
          width: 360px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        h2 {
          text-align: center;
        }
        input {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
        }
        button {
          width: 100%;
          padding: 10px;
          margin-top: 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Reset Password</h2>
        <form method="POST" action="/api/v1/users/reset-password">
          <input type="hidden" name="email" value="${email}" />
          <input type="hidden" name="token" value="${token}" />

          <input type="password" name="new_password" placeholder="Password baru" required />
          <input type="password" name="confirm_password" placeholder="Konfirmasi password" required />

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </body>
    </html>
  `);
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
