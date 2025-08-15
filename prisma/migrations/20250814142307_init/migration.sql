-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[],
    "currentHashedRefreshToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastPasswordChange" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "socialProvider" TEXT,
    "socialId" TEXT,
    "loginIp" TEXT,
    "loginUserAgent" TEXT,
    "previousPasswords" JSONB DEFAULT '[]',
    "securityQuestions" JSONB DEFAULT '[]',
    "mfaRecoveryCodes" JSONB DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
