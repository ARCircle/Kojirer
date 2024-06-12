INSERT INTO sizes (label) VALUES
  ('並'), ('大');

INSERT INTO toppings (label) VALUES
  ('マヨネーズ'),
  ('フライドオニオン'),
  ('カレー粉'),
  ('レモン果汁');

INSERT INTO size_prices (size_id, price, since) VALUES
  (1, 400, '2023-10-19 00:00:00 JST'),
  (2, 500, '2023-10-19 00:00:00 JST');

INSERT INTO topping_prices (topping_id, price, since) VALUES
  (1, 50, '2023-10-19 00:00:00 JST'),
  (2, 50, '2023-10-19 00:00:00 JST'),
  (3, 50, '2023-10-19 00:00:00 JST'),
  (4, 50, '2023-10-19 00:00:00 JST');

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
