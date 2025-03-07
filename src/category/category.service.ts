import { Inject, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { ProductCategeoryResponse } from 'src/model/product.category.model';
import { Logger } from 'winston';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toCategoryResponse(category: Category): ProductCategeoryResponse {
    if (!category) {
      throw new Error('Category is undefined or null');
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  async getAllCategory(): Promise<ProductCategeoryResponse[]> {
    this.logger.debug(`BisamartService.getAllCategory()`);

    const categories = await this.prismaService.category.findMany();

    // convert to array
    return categories.map((category) => this.toCategoryResponse(category));
  }
}
