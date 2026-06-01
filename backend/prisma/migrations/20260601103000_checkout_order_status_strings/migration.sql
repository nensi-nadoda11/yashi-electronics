ALTER TABLE "Order"
ADD COLUMN "shippingLandmark" TEXT;

ALTER TABLE "Order"
ALTER COLUMN "status" TYPE TEXT USING LOWER("status"::TEXT),
ALTER COLUMN "paymentStatus" TYPE TEXT USING LOWER("paymentStatus"::TEXT);

ALTER TABLE "Payment"
ALTER COLUMN "status" TYPE TEXT USING LOWER("status"::TEXT);

DROP TYPE "OrderStatus";
DROP TYPE "PaymentStatus";
