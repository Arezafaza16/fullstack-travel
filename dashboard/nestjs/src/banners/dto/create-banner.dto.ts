import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";
import { Type, Transform } from "class-transformer";

export class CreateBannerDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    title: string;

    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    headerTitle: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    location: string;

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    description: string;

    @Type(() => Number)
    @IsNumber()
    order: number;
}