export interface UserDto {
  userId: number | null;
  username: string | null;
  password: string | null;
  role: string | null;
  status: string | null;
  isSystemUser: boolean;
}
