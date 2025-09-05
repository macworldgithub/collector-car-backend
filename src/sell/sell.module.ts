import { Module } from '@nestjs/common';
import { SellController } from './sell.controller';
import { SellService } from './sell.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('SMTP_PORT', 587),
          secure: false,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"Car Selling App" <${configService.get<string>('SMTP_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SellController],
  providers: [SellService],
})
export class SellModule {}