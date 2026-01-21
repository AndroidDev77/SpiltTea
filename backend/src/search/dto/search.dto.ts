import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
