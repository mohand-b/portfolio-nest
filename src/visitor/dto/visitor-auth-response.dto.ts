import { VisitorResponseDto } from './visitor-response.dto';

export interface VisitorAuthResponse extends VisitorResponseDto {
  accessToken: string;
  refreshToken: string;
  message?: string;
}
