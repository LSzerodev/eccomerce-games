-- Alter foreign key constraint to CASCADE on delete
-- This allows ProductOptions to be deleted even when CartItems reference them
-- CartItems will be automatically deleted when their ProductOption is deleted

-- Drop the existing foreign key constraint
ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_productOptionId_fkey";

-- Add the new foreign key constraint with CASCADE on delete
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productOptionId_fkey"
  FOREIGN KEY ("productOptionId")
  REFERENCES "product_options"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
