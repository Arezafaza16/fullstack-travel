import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from 'src/schemas/schema-contact';
import { Model } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
    constructor(@InjectModel(Contact.name) private contactModel: Model<Contact>) {}

    async create(createContactDto: CreateContactDto) {
        const contact = new this.contactModel(createContactDto);
        return contact.save();
    }

    async getAll() {
        return this.contactModel.find().exec();
    }

    async getById(id: string) {
        return this.contactModel.findById(id).exec();
    }

    async update(id: string, updateContactDto: UpdateContactDto) {
        return this.contactModel.findByIdAndUpdate(id, updateContactDto, { new: true }).exec();
    }

    async delete(id: string) {
        return this.contactModel.findByIdAndDelete(id).exec();
    }
}
