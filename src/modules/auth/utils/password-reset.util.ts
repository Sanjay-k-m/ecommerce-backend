import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export async function generatePasswordResetToken(expiryMs = 3600 * 1000) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = await bcrypt.hash(resetToken, 10);
  const expiry = new Date(Date.now() + expiryMs);
  return { resetToken, hashedResetToken, expiry };
}
