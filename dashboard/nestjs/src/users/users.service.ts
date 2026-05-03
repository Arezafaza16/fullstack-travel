import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/schema-user';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto) {
        const existing = await this.userModel.findOne({ email: createUserDto.email }).exec();
        if (existing) {
            throw new ConflictException('Email sudah terdaftar');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
            role: createUserDto.role ?? 'admin',
        });
        return user.save();
    }

    async getAll() {
        return this.userModel.find().select('-password').exec();
    }

    async getById(id: string) {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) throw new NotFoundException('User tidak ditemukan');
        return user;
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const user = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .select('-password')
            .exec();
        if (!user) throw new NotFoundException('User tidak ditemukan');
        return user;
    }

    async delete(id: string) {
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) throw new NotFoundException('User tidak ditemukan');
        return user;
    }
}
