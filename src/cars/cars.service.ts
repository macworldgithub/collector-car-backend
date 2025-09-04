
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from '../schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  /**
   * Create a new car
   */
  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = new this.carModel(createCarDto);
    return car.save();
  }

  /**
   * Get all cars
   */
  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }

  /**
   * Get a single car by ID
   * @param id string
   */
  async findOne(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).exec();
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  /**
   * Update a car by ID
   * @param id string
   * @param updateCarDto UpdateCarDto
   */
  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.carModel.findByIdAndUpdate(id, updateCarDto, { new: true }).exec();
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  /**
   * Delete a car by ID
   * @param id string
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.carModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Car not found');
    return { deleted: true };
  }

   /**
   * Mark a car as sold
   * @param id string
   */
  async markAsSold(id: string): Promise<Car> {
    const car = await this.carModel.findByIdAndUpdate(
      id,
      { status: 'sold' },
      { new: true },
    ).exec();

    if (!car) throw new NotFoundException('Car not found');
    return car;
  }
}
