import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { users } from '@prisma/client';

export type AuthenticatedUser = Omit<users, 'password'>;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser =>
    context.switchToHttp().getRequest().user,
);
