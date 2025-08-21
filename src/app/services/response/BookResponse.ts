import {BookDto} from '../dto/BookDto';

export interface BookResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  bookDetail: BookDto;
  bookDetailsList: BookDto[];
}
