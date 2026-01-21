import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';
import { PostType, Gender } from '@prisma/client';

export class CreatePostDto {
  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsOptional()
  personId?: string;

  // Legacy fields (deprecated - use personId)
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
