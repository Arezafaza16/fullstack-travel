import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ContactDocument = HydratedDocument<Contact>;

@Schema()
export class Contact {
    @Prop({ required: true })
    whatsapp: number;

    @Prop({ required: true })
    office: string;

    @Prop({ required: true })
    fullAddress: string;

    @Prop({ required: true })
    phoneNumber: number;

    @Prop({ required: true })
    email: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
