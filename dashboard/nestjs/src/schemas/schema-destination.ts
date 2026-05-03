import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type DestinationDocument = HydratedDocument<Destination>;

@Schema()
export class Destination {
    @Prop({ required: true })
    headerTitle: string;
    @Prop({ required: true })
    imageUrl: string;
    @Prop({ required: true })
    description: string;
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);