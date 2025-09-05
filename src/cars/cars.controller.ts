import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { extname, join, basename } from 'path';
import { Car } from '../schemas/car.schema';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../schemas/user.schema';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a car with optional images',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: '1964 Ford Thunderbird 390cu' },
        make: { type: 'string', example: 'Ford' },
        description: { type: 'string', example: 'Classic Ford Thunderbird with 390cu engine' },
        price: { type: 'number', example: 45000 },
        factoryOptions: {
          type: 'array',
          items: { type: 'string' },
          example: ['Air conditioning', 'Power steering'],
        },
        highlights: {
          type: 'array',
          items: { type: 'string' },
          example: ['One owner', 'Low mileage'],
        },
        keyFeatures: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Engine' },
              value: { type: 'string', example: '390 cu V8' },
            },
          },
        },
        specifications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Horsepower' },
              value: { type: 'string', example: '300 HP' },
            },
          },
        },
        status: { type: 'string', enum: ['unsold', 'sold'], example: 'unsold' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Car created successfully', type: Car })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/uploads/cars',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async createCar(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() images: Express.Multer.File[],
    @CurrentUser() user: User & { _id: string },
  ) {
    const imagePaths: string[] = [];

    for (const file of images) {
      try {
        const outputPath = join('./public/uploads/cars', `${uuidv4()}.webp`);

        const buffer = await fs.readFile(file.path);
        await sharp(buffer)
          .toFormat('webp')
          .toFile(outputPath);

        await fs.unlink(file.path).catch((err) => {
          console.warn(`Failed to delete original file ${file.path}: ${err.message}`);
        });

        imagePaths.push(`/uploads/cars/${basename(outputPath)}`);
      } catch (error) {
        console.error(`Error processing file ${file.filename}: ${error.message}`);
      }
    }

    return this.carsService.create(createCarDto, user._id, imagePaths);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({ status: 200, description: 'List of cars', type: [Car] })
  async findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  @ApiParam({ name: 'id', description: 'Car ID', type: String })
  @ApiResponse({ status: 200, description: 'Car details', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a car by ID (with optional image upload)' })
  @ApiParam({ name: 'id', description: 'Car ID', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update car with optional new images',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Ford Mustang' },
        price: { type: 'number', example: 50000 },
        status: { type: 'string', enum: ['unsold', 'sold'], example: 'sold' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Car updated successfully', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/uploads/cars',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateCar(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @CurrentUser() user: User & { _id: string },
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    const imagePaths: string[] = [];

    if (images && images.length > 0) {
      for (const file of images) {
        try {
          const outputPath = join('./public/uploads/cars', `${uuidv4()}.webp`);

          const buffer = await fs.readFile(file.path);
          await sharp(buffer)
            .toFormat('webp')
            .toFile(outputPath);

          await fs.unlink(file.path).catch((err) => {
            console.warn(`Failed to delete original file ${file.path}: ${err.message}`);
          });

          imagePaths.push(`/uploads/cars/${basename(outputPath)}`);
        } catch (error) {
          console.error(`Error processing file ${file.filename}: ${error.message}`);
        }
      }
    }

    return this.carsService.update(id, {
      ...updateCarDto,
      ...(imagePaths.length > 0 && { images: imagePaths }),
    }, user._id);
  }

  @Patch(':id/sold')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a car as sold' })
  @ApiParam({ name: 'id', description: 'Car ID', type: String })
  @ApiResponse({ status: 200, description: 'Car marked as sold', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async markAsSold(@Param('id') id: string, @CurrentUser() user: User & { _id: string }) {
    return this.carsService.markAsSold(id, user._id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a car by ID' })
  @ApiParam({ name: 'id', description: 'Car ID', type: String })
  @ApiResponse({ status: 200, description: 'Car deleted successfully' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async removeCar(@Param('id') id: string, @CurrentUser() user: User & { _id: string }) {
    return this.carsService.remove(id, user._id);
  }
}