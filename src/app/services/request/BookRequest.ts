import {BookDto} from '../dto/BookDto';

export interface BookRequest {
  userId: number | null;
  bookId: number | null;
  bookDetail: BookDto;
}
