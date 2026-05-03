import { Module } from '@nestjs/common';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Destination, DestinationSchema } from 'src/schemas/schema-destination';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Destination.name ,schema: DestinationSchema}])],
  controllers: [DestinationsController],
  providers: [DestinationsService]
})
export class DestinationsModule {}
