export interface DashboardDto {
  userId: number;
  incomes: { [day: string]: number };
  popularBookStock: { [bookName: string]: number };
  membershipCount: { [membership: string]: number };
  orderCount: { [day: string]: number };
}
