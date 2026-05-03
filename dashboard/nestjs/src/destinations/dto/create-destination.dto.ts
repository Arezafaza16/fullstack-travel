import { IsNotEmpty, IsString } from "class-validator";


export class CreateDestinationDto {
    @IsString()
    @IsNotEmpty()
    headerTitle: string;

    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}