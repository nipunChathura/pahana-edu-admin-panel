import {BookDto} from './BookDto';

export interface PromotionDto {
  promotionId: number | null;
  promotionName: string | null;
  promotionStartDate: string | null;
  promotionEndDate: string | null;
  promotionType: string | null;
  promotionPrice: number | null;
  priority: number | null;
  promotionStatus: string | null;
  bookIds: number [] | null;
  bookDetailsDtoList: BookDto[] | null;
}
