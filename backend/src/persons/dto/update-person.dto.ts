import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdatePersonDto {
  @IsString()
  @IsOptional()
  name?: string;

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

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
