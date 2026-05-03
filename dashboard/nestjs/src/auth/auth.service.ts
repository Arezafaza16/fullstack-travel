import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/schema-user';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Email atau password salah');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Email atau password salah');

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        const payload = { sub: user._id, email: user.email, role: user.role };
        return {
            message: 'Login berhasil',
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        const payload = { sub: user._id, email: user.email, role: user.role };
        return {
            message: 'Registrasi berhasil',
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) throw new NotFoundException('Email tidak ditemukan');

        // Generate a cryptographically secure random token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(rawToken, 10);

        // Store hashed token + 1-hour expiry
        user.resetToken = hashedToken;
        user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

        await transporter.sendMail({
            from: `"TravelDash" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Reset Password – TravelDash',
            html: `
                <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                    <h2 style="color: #1e40af; margin-bottom: 8px;">Reset Password</h2>
                    <p style="color: #475569; margin-bottom: 24px;">Anda menerima email ini karena permintaan reset password untuk akun TravelDash Anda. Klik tombol di bawah untuk melanjutkan.</p>
                    <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Link ini hanya berlaku selama 1 jam dan hanya dapat digunakan sekali. Jika Anda tidak meminta reset password, abaikan email ini.</p>
                    <p style="color: #94a3b8; font-size: 12px;">Token: <code>${rawToken}</code></p>
                </div>
            `,
        });

        return { message: 'Email reset password telah dikirim. Periksa inbox Anda.' };
    }

    async resetPassword(token: string, email: string, newPassword: string) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user || !user.resetToken || !user.resetTokenExpiry) {
            throw new BadRequestException('Token tidak valid atau sudah kedaluwarsa');
        }

        // Check expiry
        if (new Date() > user.resetTokenExpiry) {
            throw new BadRequestException('Token sudah kedaluwarsa. Minta reset password baru.');
        }

        // Verify token
        const isValidToken = await bcrypt.compare(token, user.resetToken);
        if (!isValidToken) {
            throw new BadRequestException('Token tidak valid');
        }

        // Hash new password and clear token (one-time use)
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return { message: 'Password berhasil direset. Silakan login dengan password baru Anda.' };
    }
}
