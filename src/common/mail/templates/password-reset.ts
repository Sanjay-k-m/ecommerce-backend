export function passwordResetTemplate(resetUrl: string): string {
  return `
    <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
    <p>This link will expire in 1 hour.</p>
  `;
}
