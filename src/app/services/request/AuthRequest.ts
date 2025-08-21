import { Request } from './Request';

export interface AuthRequest extends Request {
  username: string;
  password: string;
  email:string;
}
