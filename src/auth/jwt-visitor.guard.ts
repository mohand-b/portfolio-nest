import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtVisitorGuard extends AuthGuard('visitor-jwt') {}
