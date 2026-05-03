import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from 'src/schemas/schema-destination';

@Injectable()
export class DestinationsService {
    constructor(@InjectModel(Destination.name) private destinationModel: Model<Destination>) {}

    async create(createDestinationDto: CreateDestinationDto){
        const destination = new this.destinationModel(createDestinationDto);
        return destination.save();
    }

    async getAllDestinations(){
        return this.destinationModel.find().exec();
    }

    async getDestinationById(id: string){
        return this.destinationModel.findById(id).exec();
    }

    async update(id: string, updateDestinationDto: UpdateDestinationDto){
        return this.destinationModel.findByIdAndUpdate(id, updateDestinationDto, { new: true }).exec();
    }

    async delete(id: string){
        return this.destinationModel.findByIdAndDelete(id).exec();
    }
}
