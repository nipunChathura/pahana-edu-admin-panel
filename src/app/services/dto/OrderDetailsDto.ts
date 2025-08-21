import {BookDto} from './BookDto';
import {PromotionDto} from './PromotionDto';

export interface OrderDetailsDto {
  orderDetailId: number | null;
  orderId: number | null;
  bookId: number | null;
  book: BookDto;
  itemPrice: number | null;
  itemQuantity: number | null;
  discountPrice: number | null;
  promotionId: number | null;
  promotion: PromotionDto;
}
