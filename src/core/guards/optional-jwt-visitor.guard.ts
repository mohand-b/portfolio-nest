import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtVisitorGuard extends AuthGuard('visitor-jwt') {
  handleRequest(err: any, user: any) {
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch {}
    return true;
  }
}
