import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from 'src/schemas/schema-card';

@Injectable()
export class CardsService {
    constructor(@InjectModel(Card.name) private cardModel: Model<Card>) {}

    async create(createCardDto: CreateCardDto){
        const card = new this.cardModel(createCardDto);
        return card.save();
    }

    async getAllCards(){
        return this.cardModel.find().exec();
    }

    async getCardById(id: string){
        return this.cardModel.findById(id).exec();
    }

    async update(id: string, updateCardDto: UpdateCardDto){
        return this.cardModel.findByIdAndUpdate(id, updateCardDto, { new: true }).exec();
    }

    async delete(id: string){
        return this.cardModel.findByIdAndDelete(id).exec();
    }
}
