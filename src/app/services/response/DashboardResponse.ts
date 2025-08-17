import {DashboardDto} from '../dto/DashboardDto';

export interface DashboardResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  dashboardDetails: DashboardDto;
}
