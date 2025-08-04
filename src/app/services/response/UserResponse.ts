import {UserDto} from '../dto/UserDto';

export interface UserResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  userId: number | null;
  userDto: UserDto;
  userDtos: UserDto [];
}
