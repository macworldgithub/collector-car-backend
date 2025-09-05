import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SellCarDto {
  @ApiProperty({ example: 'Mr' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ example: 'Ford' })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty({ example: 'Thunderbird' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: '1964' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({ example: 'ABC123' })
  @IsString()
  @IsNotEmpty()
  registration: string;

  @ApiProperty({ example: '50000' })
  @IsString()
  @IsNotEmpty()
  mileage: string;

  @ApiProperty({ example: 'Classic Ford Thunderbird in great condition' })
  @IsString()
  @IsNotEmpty()
  comments: string;

  @ApiProperty({ example: ['Email', 'Telephone'] })
  @IsArray()
  @IsString({ each: true })
  contactPrefs: string[];
}