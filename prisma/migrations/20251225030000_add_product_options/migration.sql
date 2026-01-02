-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "product_options" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- Migrate existing product data to product_options
-- Create a default option for each existing product
INSERT INTO "product_options" ("id", "productId", "name", "description", "price", "stock", "createdAt", "updatedAt")
SELECT
    uuid_generate_v4()::text as "id",
    "id" as "productId",
    "name" || ' - Padrão' as "name",
    "description",
    "price",
    "stock",
    "createdAt",
    "updatedAt"
FROM "products";

-- Add productOptionId column to cart_items (temporarily nullable)
ALTER TABLE "cart_items" ADD COLUMN "productOptionId" TEXT;

-- Migrate cart_items to use productOptionId
-- For each cart_item, find the corresponding product_option
UPDATE "cart_items" ci
SET "productOptionId" = (
    SELECT po."id"
    FROM "product_options" po
    WHERE po."productId" = ci."productId"
    LIMIT 1
);

-- Make productOptionId NOT NULL now that all rows have values
ALTER TABLE "cart_items" ALTER COLUMN "productOptionId" SET NOT NULL;

-- Drop the old unique constraint
DROP INDEX IF EXISTS "cart_items_cartId_productId_key";

-- Create new unique constraint
CREATE UNIQUE INDEX "cart_items_cartId_productOptionId_key" ON "cart_items"("cartId", "productOptionId");

-- Drop the old foreign key
ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_productId_fkey";

-- Add new foreign key
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "product_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop productId column from cart_items
ALTER TABLE "cart_items" DROP COLUMN "productId";

-- Drop price and stock columns from products
ALTER TABLE "products" DROP COLUMN "price";
ALTER TABLE "products" DROP COLUMN "stock";

-- Add foreign key for product_options -> products
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
