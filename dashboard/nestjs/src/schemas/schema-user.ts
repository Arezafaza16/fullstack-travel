import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['owner', 'admin'], default: 'admin' })
    role: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    phoneNumber: number;

    @Prop()
    resetToken?: string;

    @Prop()
    resetTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
