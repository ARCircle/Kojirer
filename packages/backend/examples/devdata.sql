BEGIN;

-- Truncate tables to remove existing data
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE dons RESTART IDENTITY CASCADE;
TRUNCATE TABLE adding RESTART IDENTITY CASCADE;


-- Insert new data
INSERT INTO orders (created_at, call_num) VALUES
  ('2023-10-19 10:23:54 JST', 1),
  ('2023-10-19 10:26:30 JST', 2),
  ('2023-10-19 10:28:45 JST', 4);

INSERT INTO dons (
  size_id,
  order_id,
  status,
  yasai,
  ninniku,
  karame,
  abura,
  sns_followed,
  created_at,
  updated_at
) VALUES
  (1, 1, 1, 1, 1, 1, 1, false, '2023-10-19 10:23:54 JST', '2023-10-19 10:23:54 JST'),
  (1, 2, 1, 1, 0, 0, 0, false, '2023-10-19 10:26:30 JST', '2023-10-19 10:26:30 JST'),
  (2, 2, 1, 2, 2, 2, 2, false, '2023-10-19 10:26:30 JST', '2023-10-19 10:26:30 JST'),
  (2, 3, 1, 1, 2, 1, 1, false, '2023-10-19 10:28:45 JST', '2023-10-19 10:28:45 JST');

INSERT INTO adding (don_id, topping_id, amount) VALUES
  (2, 1, 1),
  (2, 2, 1),
  (4, 4, 1);


COMMIT;
