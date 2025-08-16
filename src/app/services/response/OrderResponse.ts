import {OrderDto} from '../dto/OrderDto';
import {CustomerDto} from '../dto/CustomerDto';
import {OrderDetailsDto} from '../dto/OrderDetailsDto';

export interface OrderResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  userId: number | null;
  customerId: number | null;
  orderId: number | null;
  customerDto: CustomerDto;
  orderDto: OrderDto;
  orderList: OrderDto[];
  detailDetailList: OrderDetailsDto[];
}
