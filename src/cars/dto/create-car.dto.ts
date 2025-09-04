import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class KeyValueDto {
  @ApiProperty({ example: 'Engine' })
  @IsString()
  label: string;

  @ApiProperty({ example: '390 cu V8' })
  @IsString()
  value: string;
}

export class CreateCarDto {
  @ApiProperty({ example: '1964 Ford Thunderbird 390cu' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Ford' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiPropertyOptional({ example: 'Classic Ford Thunderbird with 390cu engine' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Add this to transform string to number
  price?: number;

  @ApiPropertyOptional({ type: [String], example: ['/uploads/cars/car1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[] = [];

  @ApiPropertyOptional({ example: ['Air conditioning', 'Power steering'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  factoryOptions?: string[] = [];

  @ApiPropertyOptional({ example: ['One owner', 'Low mileage'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[] = [];

  @ApiPropertyOptional({ type: [KeyValueDto], example: [{ label: 'Engine', value: '390 cu V8' }] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValueDto)
  keyFeatures?: KeyValueDto[] = [];

  @ApiPropertyOptional({ type: [KeyValueDto], example: [{ label: 'Horsepower', value: '300 HP' }] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValueDto)
  specifications?: KeyValueDto[] = [];

  @ApiPropertyOptional({ enum: ['unsold', 'sold'], example: 'unsold' })
  @IsOptional()
  @IsEnum(['unsold', 'sold'])
  status?: 'unsold' | 'sold' = 'unsold';
}