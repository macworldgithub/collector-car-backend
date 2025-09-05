import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SellCarDto } from './dto/sell.dto';
@Injectable()
export class SellService {
  constructor(private readonly mailerService: MailerService) {}

  async sendSellInquiry(sellCarDto: SellCarDto): Promise<void> {
    const { title, firstName, lastName, email, telephone, manufacturer, model, year, registration, mileage, comments, contactPrefs } = sellCarDto;

    const emailContent = `
      New Car Selling Inquiry:
      
      Personal Information:
      - Title: ${title}
      - First Name: ${firstName}
      - Last Name: ${lastName}
      - Email: ${email}
      - Telephone: ${telephone}
      
      Car Details:
      - Manufacturer: ${manufacturer}
      - Model: ${model}
      - Year: ${year}
      - Registration: ${registration}
      - Mileage: ${mileage}
      - Comments: ${comments}
      
      Contact Preferences: ${contactPrefs.join(', ')}
    `;

    await this.mailerService.sendMail({
      to: 'admin@yourdomain.com', // Replace with your admin email
      subject: 'New Car Selling Inquiry',
      text: emailContent,
    });
  }
}