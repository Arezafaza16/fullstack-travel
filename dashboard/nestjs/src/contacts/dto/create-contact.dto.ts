import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateContactDto {
    @Type(() => Number)
    @IsNumber()
    whatsapp: number;

    @IsNotEmpty()
    @IsString()
    office: string;

    @IsNotEmpty()
    @IsString()
    fullAddress: string;

    @Type(() => Number)
    @IsNumber()
    phoneNumber: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
