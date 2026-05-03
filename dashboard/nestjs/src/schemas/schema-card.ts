import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
    @Prop({ required: true })
    headerTitle: string;
    @Prop({ required: true })
    imageUrl: string;
    @Prop({ required: true })
    duration: string;
    @Prop({ required: true })
    price: number;
    @Prop({ required: true })
    description: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
