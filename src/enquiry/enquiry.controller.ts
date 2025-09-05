import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnquiryService } from './enquiry.service';
import { EnquiryDto } from './dto/enquiry.dto';

@ApiTags('enquiry')
@Controller('enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a vehicle enquiry form' })
  @ApiBody({
    description: 'Vehicle enquiry form data',
    type: EnquiryDto,
  })
  @ApiResponse({ status: 201, description: 'Enquiry submitted and email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async submitEnquiry(@Body() enquiryDto: EnquiryDto) {
    await this.enquiryService.sendEnquiry(enquiryDto);
    return { message: 'Enquiry submitted successfully' };
  }
}