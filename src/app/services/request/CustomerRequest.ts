import {CustomerDto} from '../dto/CustomerDto';

export interface CustomerRequest {
  userId: number | null;
  customerId: number | null;
  customerDto: CustomerDto;
}
