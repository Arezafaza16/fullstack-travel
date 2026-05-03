import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}

    @Get()
    async getAllContacts() {
        return this.contactsService.getAll();
    }

    @Get(':id')
    async getContactById(@Param('id') id: string) {
        return this.contactsService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createContact(@Body() createContactDto: CreateContactDto) {
        const contact = await this.contactsService.create(createContactDto);
        return {
            message: 'Kontak berhasil ditambahkan',
            data: contact,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateContact(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
        const contact = await this.contactsService.update(id, updateContactDto);
        return {
            message: 'Kontak berhasil diupdate',
            data: contact,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async deleteContact(@Param('id') id: string) {
        return this.contactsService.delete(id);
    }
}
