BEGIN;

TRUNCATE TABLE options RESTART IDENTITY CASCADE;
TRUNCATE TABLE toppings RESTART IDENTITY CASCADE;
TRUNCATE TABLE topping_prices RESTART IDENTITY CASCADE;
TRUNCATE TABLE sizes RESTART IDENTITY CASCADE;
TRUNCATE TABLE size_prices RESTART IDENTITY CASCADE;

-- Insert new data
INSERT INTO options (label) VALUES
  ('ナシ'),
  ('少なめ'),
  ('普通'),
  ('マシ'),
  ('マシマシ')

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

COMMIT;
