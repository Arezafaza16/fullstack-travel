import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Controller('destinations')
export class DestinationsController {
    constructor(private readonly destinationsService: DestinationsService) {}

    @Get()
    getAllDestinations(){
        return this.destinationsService.getAllDestinations();
    }

    @Get(':id')
    getDestinationById(@Param('id') id: string){
        return this.destinationsService.getDestinationById(id);
    }

    @Post()
    createDestination(@Body() createDestinationDto: CreateDestinationDto){
        return this.destinationsService.create(createDestinationDto);
    }

    @Put(':id')
    updateDestination(@Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto){
        return this.destinationsService.update(id, updateDestinationDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteDestination(@Param('id') id: string){
        return this.destinationsService.delete(id);
    }
}
