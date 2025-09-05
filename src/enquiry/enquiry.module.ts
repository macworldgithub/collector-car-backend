import { Module } from '@nestjs/common';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
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
          from: `"Car Enquiry App" <${configService.get<string>('SMTP_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EnquiryController],
  providers: [EnquiryService],
})
export class EnquiryModule {}