import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';
import { AuthModule } from './auth/auth.module';
import { SellModule } from './sell/sell.module';
import { EnquiryModule } from './enquiry/enquiry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI', 'mongodb://localhost:27017/carsdb'),
      }),
      inject: [ConfigService],
    }),
    CarsModule,
    AuthModule,
    SellModule,
    EnquiryModule,
  ],
})
export class AppModule {}