import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PromoService } from './promo.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { CreatePromoRequest, PromoResponse } from 'src/model/promo.model';
import { WebResponse } from 'src/model/web.model';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Promo')
@Controller('/api/v1/promo')
export class PromoController {
  constructor(private promoService: PromoService) {}

  @Post('/new')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Create new promo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'thumbnail',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'thumbnail') {
              cb(null, './public/promo');
            }
          },
          filename(req, file, cb) {
            const timestamp = Date.now();
            const prefix = 'PROMO';
            const filename = `${prefix}-${timestamp}${extname(file.originalname)}`;
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async createPromo(
    @Auth() user: User,
    @Body() request: CreatePromoRequest,
    @UploadedFiles() file: { image: Express.Multer.File[] },
  ): Promise<WebResponse<PromoResponse>> {
    const result = await this.promoService.createPromo(user, request, file);
    return {
      data: result,
    };
  }

  @Get('/promos')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Get all promo, use page and take for fastest render data. example : /promo?page=1&take10',
  })
  async getAllPromo(
    @Query('page') page = '1',
    @Query('take') take = '10',
    @Query('search') search?: string,
  ): Promise<WebResponse<PromoResponse[]>> {
    const pageNumber = Number(page);
    const takeNumber = Number(take);

    const result = await this.promoService.getALlPromo(
      pageNumber,
      takeNumber,
      search,
    );

    return {
      data: result,
    };
  }

  @Delete('/promo/:id')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Delete promo by ID' })
  async deletePromoById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<boolean>> {
    await this.promoService.deletePromoById(id);
    return {
      data: true,
    };
  }
}
