import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsUUID } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateVettingRequestDto {
  @IsUUID()
  @IsOptional()
  targetUserId?: string;

  @IsUUID()
  @IsOptional()
  postId?: string;

  @IsString()
  @IsNotEmpty()
  targetName: string;

  @IsInt()
  @IsOptional()
  targetAge?: number;

  @IsEnum(Gender)
  @IsOptional()
  targetGender?: Gender;

  @IsString()
  @IsOptional()
  targetLocation?: string;

  @IsString()
  @IsOptional()
  targetDescription?: string;
}
