import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { WebResponse } from "src/model/web.model";
import { CategeoryResponse } from "src/model/category.model";

@ApiTags('Category Product')
@Controller('api/v1/category-product')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}
    @Get('/')
      @HttpCode(200)
      @ApiOperation({ summary: 'Get all category product' })
      async getAllProduct(): Promise<WebResponse<CategeoryResponse[]>> {
        const result = await this.categoryService.getAllCategory();
        return {
          data: result,
        };
      }
}