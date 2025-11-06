export class VisitorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  lastVisitAt: Date;
  avatarSvg?: string;
  achievements: {
    unlocked: number;
    total: number;
    percentCompletion: number;
  };
}
