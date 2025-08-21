import {PromotionDto} from '../dto/PromotionDto';

export interface PromotionRequest {
  promotionId: number | null;
  bookId: number | null;
  requestBookDetails: boolean;
  promotionDto: PromotionDto | null;
}
