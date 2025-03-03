import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
  VerifiedUserRequest,
} from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toUserResponse(user: User): UserResponse {
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
      email: user.email,
      roles: user.roles,
      is_verified: user.is_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    if (user.token) {
      userResponse.token = user.token;
    }

    return userResponse;
  }

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.register(${JSON.stringify(request)})`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const [totalUserWithSamePhoneNumber, totalUserWithSameEmail] =
      await Promise.all([
        this.prismaService.user.count({
          where: { phone_number: registerRequest.phone_number },
        }),
        this.prismaService.user.count({
          where: { email: registerRequest.email },
        }),
      ]);

    if (totalUserWithSamePhoneNumber != 0) {
      throw new HttpException('Phone number already exist', 400);
    }

    if (totalUserWithSameEmail != 0) {
      throw new HttpException('Email already exist', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name: registerRequest.name,
        email: registerRequest.email,
        phone_number: registerRequest.phone_number,
        password: registerRequest.password,
      },
    });

    return this.toUserResponse(user);
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.Login(${JSON.stringify(request)})`);

    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        phone_number: loginRequest.phone_number,
      },
    });

    if (!user) {
      throw new HttpException('Phone number or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Phone number or password is invalid', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        phone_number: loginRequest.phone_number,
      },
      data: {
        token: uuid(),
      },
    });

    return this.toUserResponse(user);
  }

  private async createOtpEmail(email: string, otp: string) {
    // Konfigurasi SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Bisa diganti ke SMTP lain
      auth: {
        user: process.env.SMTP_USER, // Email pengirim
        pass: process.env.SMTP_PASS, // Password email pengirim
      },
    });

    // Isi email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Kode OTP Verifikasi Bisamart',
      text: `Kode OTP Anda adalah: ${otp}. Berlaku selama 5 menit.`,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);
    this.logger.debug(`OTP terkirim ke ${email}`);
  }

  async sendOtp(user: User) {
    this.logger.debug(`UserService.sendOtpUser ( ${JSON.stringify(user)})`);

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expire dalam 5 menit

    // 2️⃣ Simpan OTP ke database
    await this.prismaService.userOTP.upsert({
      where: { user_id: user.id },
      update: { otp, expiresAt },
      create: { user_id: user.id, otp, expiresAt },
    });

    // 3️⃣ Kirim OTP ke email pengguna
    await this.createOtpEmail(user.email, otp);

    return {
      message: 'OTP telah dikirim ke email Anda',
    };
  }

  async verifiedOtp(user: User, request: VerifiedUserRequest) {
    this.logger.debug(`UserService.verifiedOtpUser ( ${JSON.stringify(user)})`);

    const verifiedRequest: VerifiedUserRequest =
      this.validationService.validate(UserValidation.VERIFIED, request);


    const userOtp = await this.prismaService.userOTP.findUnique({
      where: { user_id: user.id },
    });

    if (
      !userOtp ||
      userOtp.otp !== verifiedRequest.otp ||
      userOtp.expiresAt < new Date()
    ) {

      throw new HttpException('OTP tidak valid atau sudah kedaluwarsa', 401);
    }

    // Hapus OTP setelah verifikasi berhasil
    await this.prismaService.userOTP.delete({
      where: { user_id: user.id },
    });

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        is_verified: true,
      },
    });

    return {
      message: 'Verifikasi berhasil',
    };
  }

  async get(user: User): Promise<UserResponse> {
    this.logger.debug(`UserService.Get ( ${JSON.stringify(user)})`);
    return this.toUserResponse(user);
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.Update(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        phone_number: user.phone_number,
      },
      data: user,
    });

    return this.toUserResponse(result);
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        token: null,
      },
    });

    return this.toUserResponse(result);
  }
}
