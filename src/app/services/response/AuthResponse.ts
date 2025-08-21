import {Response} from './Response';

export interface AuthResponse extends Response {
  token: string;
  userRole: string;
  userId: number;
  username: string;
}
