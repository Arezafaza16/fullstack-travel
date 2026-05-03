import { Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from 'src/schemas/schema-banner';

@Module({
   imports: [ MongooseModule.forFeature([{ name: Banner.name ,schema: BannerSchema}])],
  controllers: [BannersController],
  providers: [BannersService]
})
export class BannersModule {}
