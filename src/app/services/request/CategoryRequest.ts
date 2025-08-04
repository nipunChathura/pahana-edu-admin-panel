import {CategoryDto} from '../dto/CategoryDto';

export interface CategoryRequest {
  userId: number | null;
  categoryId: number | null;
  categoryDetail: CategoryDto | null;
}
