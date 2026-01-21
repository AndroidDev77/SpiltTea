import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  aliases?: string[];

  @IsInt()
  @Min(18)
  @Max(120)
  @IsOptional()
  approximateAge?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}
