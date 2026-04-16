-- Migration to ensure the column name is 'price' regardless of whether it was created as 'price_at_purchase' or 'price'
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'price_at_purchase'
    ) THEN
        ALTER TABLE order_items RENAME COLUMN price_at_purchase TO price;
    END IF;
END $$;
