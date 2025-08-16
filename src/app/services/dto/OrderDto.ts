import {CustomerDto} from './CustomerDto';
import {OrderDetailsDto} from './OrderDetailsDto';

export interface OrderDto {
  orderId: number | null;
  customerId: number | null;
  customer: CustomerDto;
  orderDate: string | null;
  totalAmount: number | null;
  discountAmount: number | null;
  paidAmount: number | null;
  paymentType: string | null;
  orderDetailDtos: OrderDetailsDto[];
}
