import {CustomerDto} from '../dto/CustomerDto';
import {OrderDto} from '../dto/OrderDto';
import {OrderDetailsDto} from '../dto/OrderDetailsDto';

export interface OrderRequest {
  orderId: number | null;
  customerId: number | null;
  detailsRequested: boolean | null;
  customerDto: CustomerDto | null;
  OrderDto: OrderDto | null;
  orderList: OrderDto[] | null;
  detailDetailList: OrderDetailsDto[] | null;
}
