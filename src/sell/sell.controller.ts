import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SellService } from './sell.service';
import { SellCarDto } from './dto/sell.dto';
@ApiTags('sell')
@Controller('sell')
export class SellController {
  constructor(private readonly sellService: SellService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a car selling inquiry form' })
  @ApiBody({
    description: 'Car selling inquiry form data',
    type: SellCarDto,
  })
  @ApiResponse({ status: 201, description: 'Inquiry submitted and email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async submitSellForm(@Body() sellCarDto: SellCarDto) {
    await this.sellService.sendSellInquiry(sellCarDto);
    return { message: 'Inquiry submitted successfully' };
  }
}