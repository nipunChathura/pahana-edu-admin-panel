import {CategoryDto} from '../dto/CategoryDto';

export interface CategoryApiResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  categoryDetailsList: CategoryDto[];
}
