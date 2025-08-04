import {CustomerDto} from '../dto/CustomerDto';

export interface CustomerResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  userId: number | null;
  customerId: number | null;
  customerDto: CustomerDto;
  customerDtoList: CustomerDto[];
}
