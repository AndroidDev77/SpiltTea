import { IsString, IsOptional, IsInt, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  personName?: string;

  @IsInt()
  @IsOptional()
  personAge?: number;

  @IsEnum(Gender)
  @IsOptional()
  personGender?: Gender;

  @IsString()
  @IsOptional()
  personLocation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  evidenceUrls?: string[];

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
