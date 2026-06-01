-- CreateIndex
CREATE INDEX IF NOT EXISTS "Wishlist_customerId_idx" ON "Wishlist"("customerId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Wishlist_productId_idx" ON "Wishlist"("productId");
