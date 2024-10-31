BEGIN;

-- Truncate tables to remove existing data
TRUNCATE TABLE options RESTART IDENTITY CASCADE;
TRUNCATE TABLE toppings RESTART IDENTITY CASCADE;
TRUNCATE TABLE topping_prices RESTART IDENTITY CASCADE;
TRUNCATE TABLE sizes RESTART IDENTITY CASCADE;
TRUNCATE TABLE size_prices RESTART IDENTITY CASCADE;
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE dons RESTART IDENTITY CASCADE;
TRUNCATE TABLE adding RESTART IDENTITY CASCADE;

-- Insert master data
INSERT INTO options (label) VALUES
  ('ナシ'),
  ('少なめ'),
  ('普通'),
  ('マシ'),
  ('マシマシ');

INSERT INTO toppings (label) VALUES
  ('マヨ'),
  ('レモン汁'),
  ('カレー粉'),
  ('コショウ'),
  ('フライドオニオン');

INSERT INTO topping_prices (topping_id, price, since) VALUES
  (1, 50, '2024-10-30 00:00:00 JST'),
  (1, 50, '2024-10-30 00:00:00 JST'),
  (1, 50, '2024-10-30 00:00:00 JST'),
  (1, 50, '2024-10-30 00:00:00 JST'),
  (1, 50, '2024-10-30 00:00:00 JST');

INSERT INTO sizes (label) VALUES
  ('並');

INSERT INTO size_prices (size_id, price, since) VALUES
  (1, 400, '2024-10-30 00:00:00 JST');


-- Insert example data
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
