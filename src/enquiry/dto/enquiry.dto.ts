import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class EnquiryDto {
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

  @ApiProperty({ example: 'Interested in the 1964 Ford Thunderbird' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: ['By Email', 'By Telephone'] })
  @IsArray()
  @IsString({ each: true })
  contactPreferences: string[];
}