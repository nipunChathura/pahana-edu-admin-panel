import {AwardDto} from './AwardDto';

export interface BookDto {
  bookId: number | null;
  name: string | null;
  categoryId: number | null;
  categoryName: string | null;
  description: string | null;
  language: string | null;
  author: string | null;
  publisher: string | null;
  publishDate: string | null;
  isbn: string | null;
  price: number | null;
  isPromotionEnable: boolean;
  promotionId: number | null;
  promotionType: string | null;
  promotionPrice: number | null;
  promotionBookPrice: number | null;
  quantity: number | null;
  imageUrl: string | null;
  bookStatus: string | null;
  awardList: AwardDto[];
}
