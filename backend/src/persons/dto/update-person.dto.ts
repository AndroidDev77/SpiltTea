import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
  Max,
  Matches,
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
  @Matches(/^[+]?[\d\s\-()]{7,20}$/, {
    message: 'Phone number must be a valid format',
  })
  @IsOptional()
  phoneNumber?: string;

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
