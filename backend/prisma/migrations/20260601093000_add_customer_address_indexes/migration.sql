-- CreateIndex
CREATE INDEX IF NOT EXISTS "CustomerAddress_customerId_idx" ON "CustomerAddress"("customerId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CustomerAddress_customerId_isDefault_idx" ON "CustomerAddress"("customerId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "CustomerAddress_customerId_default_key" ON "CustomerAddress"("customerId") WHERE "isDefault" = true;
