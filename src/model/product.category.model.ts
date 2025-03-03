export class CreateProductCategeoryRequest {}
export class ProductCategeoryResponse {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
