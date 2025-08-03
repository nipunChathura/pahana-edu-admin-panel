import {UserDto} from '../dto/UserDto';

export interface UserRequest {
  userId: number | null;
  userStatus: string | null;
  searchValue: string | null;
  userDto: UserDto;
}
