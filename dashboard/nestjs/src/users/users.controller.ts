import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers() {
        return this.usersService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.usersService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        const { password: _, ...result } = user.toObject();
        return {
            message: 'User berhasil ditambahkan',
            data: result,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(id, updateUserDto);
        return {
            message: 'User berhasil diupdate',
            data: user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
