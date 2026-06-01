CREATE TABLE "PendingCustomerRegistration" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "passwordHash" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "otpExpiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingCustomerRegistration_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PendingCustomerRegistration_email_key" ON "PendingCustomerRegistration"("email");
CREATE UNIQUE INDEX "PendingCustomerRegistration_mobile_key" ON "PendingCustomerRegistration"("mobile");
