export interface VisitorAuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  message?: string;
}
