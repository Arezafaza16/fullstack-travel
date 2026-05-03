import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannersService } from './banners.service';

@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) {}
    
    @Get()
    getAllBanners(){
        return this.bannersService.getAllBanners();
    }

    @Get(':id')
    getBannerbyId(@Param('id') id: string){
        return this.bannersService.getBannerById(id);
    }
    
    @Post()
    async createBanner(@Body() createBannerDto: CreateBannerDto){
        const banner = await this.bannersService.create(createBannerDto);

        return {
            message: "Banner berhasil ditambahkan",
            data: banner
        };
    }
    
    @Put(':id')
    async updateBanner(@Param("id") id: string, @Body() updateBannerDto: UpdateBannerDto){
        const banner = await this.bannersService.update(id, updateBannerDto);
        return {
            message: "Banner berhasil diupdate",
            data: banner
        };
    }
    
    @Delete(':id')
    @HttpCode(204)
    deleteBannerById(@Param('id') id: string){
        return this.bannersService.delete(id);
    }
}
