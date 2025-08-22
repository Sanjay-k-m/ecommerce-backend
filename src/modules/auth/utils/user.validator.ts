import { User } from '@prisma/client';
import { comparePassword } from 'src/common/utils';
import { normalizeEmail } from 'src/modules/auth/utils/email.util';
import { UsersService } from 'src/modules/users/users.service';

export async function validateUser(
  usersService: UsersService,
  email: string,
  password: string,
): Promise<Omit<User, 'password'> | null> {
  const normalizedEmail = normalizeEmail(email);
  const user = await usersService.findByEmail(normalizedEmail);
  if (!user || user.status !== 'active') return null;

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    await usersService.incrementFailedLoginAttempts(user.id);
    return null;
  }

  await usersService.updateUser(user.id, { failedLoginAttempts: 0 });

  // remove password field before returning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...result } = user;
  return result;
}
