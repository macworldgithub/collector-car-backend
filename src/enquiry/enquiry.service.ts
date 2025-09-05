import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EnquiryDto } from './dto/enquiry.dto';

@Injectable()
export class EnquiryService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEnquiry(enquiryDto: EnquiryDto): Promise<void> {
    const { firstName, lastName, email, telephone, message, contactPreferences } = enquiryDto;

    const emailContent = `
      New Vehicle Enquiry:
      
      Personal Information:
      - First Name: ${firstName}
      - Last Name: ${lastName}
      - Email: ${email}
      - Telephone: ${telephone}
      
      Message: ${message}
      
      Contact Preferences: ${contactPreferences.join(', ')}
    `;

    await this.mailerService.sendMail({
      to: 'admin@yourdomain.com', // Replace with your admin email
      subject: 'New Vehicle Enquiry',
      text: emailContent,
    });
  }
}