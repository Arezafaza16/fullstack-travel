import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    getAllCards(){
        return this.cardsService.getAllCards();
    }

    @Get(':id')
    getCardById(@Param('id') id: string){
        return this.cardsService.getCardById(id);
    }

    @Post()
    createCard(@Body() createCardDto: CreateCardDto){
        return this.cardsService.create(createCardDto);
    }

    @Put(':id')
    updateCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto){
        return this.cardsService.update(id, updateCardDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteCard(@Param('id') id: string){
        return this.cardsService.delete(id);
    }
}
