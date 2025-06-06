import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { JwtVisitorStrategy } from './strategies/jwt-visitor.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
      }),
    }),
  ],
  providers: [JwtAdminStrategy, JwtVisitorStrategy],
  exports: [JwtModule, PassportModule],
})
export class CoreModule {}
