import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { WebResponse } from 'src/model/web.model';
import { DriverResponse, RegisterDriverRequest } from 'src/model/driver.model';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/api/drivers')
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Register new driver' })
  async register(
    @Body() request: RegisterDriverRequest,
  ): Promise<WebResponse<DriverResponse>> {
    const result = await this.driverService.register(request);
    return {
      data: result,
    };
  }
}
