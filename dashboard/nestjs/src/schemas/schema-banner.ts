import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type BannerDocument = HydratedDocument<Banner>;

@Schema()
export class Banner {
    @Prop({ required: true })
    title: string;
    @Prop({ required: true})
    imageUrl: string;
    @Prop({ required: true })
    headerTitle: string;
    @Prop({ required: true })
    location: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    order: number;
}

export const BannerSchema = SchemaFactory.createForClass(Banner)