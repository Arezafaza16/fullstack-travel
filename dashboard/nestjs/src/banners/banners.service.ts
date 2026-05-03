import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Banner } from 'src/schemas/schema-banner';
import { Model } from 'mongoose';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
    constructor(@InjectModel(Banner.name) private bannerModel: Model<Banner>) {}

    async create(createBannerDto: CreateBannerDto) {
        const banner = new this.bannerModel(createBannerDto);
        return banner.save();
    }

    async getAllBanners(){
        return this.bannerModel.find().sort({ order: 1 }).exec();
    }

    async getBannerById(id: string){
        return this.bannerModel.findById(id).exec();
    }

    async update(id: string, updateBannerDto: UpdateBannerDto){
        return this.bannerModel.findByIdAndUpdate(id, updateBannerDto, { new: true }).exec();
    }

    async delete(id: string){
        return this.bannerModel.findByIdAndDelete(id).exec();
    }
}
