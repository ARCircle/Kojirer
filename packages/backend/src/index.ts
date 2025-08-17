import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// ===== 設定 =====
const port = Number(process.env.PORT ?? 52600);
const host = process.env.HOST ?? '0.0.0.0';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'web')));
app.use(cors());

// ヘルスチェック
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const filenames = fs.readdirSync(path.join(__dirname, 'routes'));

// ファイル名ごとにrouteを動的インポート
for (const filename of filenames) {
  if (!filename.endsWith('.js')) continue;
  const name = filename.replace('.js', '');
  const route_path = `${__dirname}/routes/${name}.js`;
  const route = require(route_path);

  app.use(`/api/${name}`, route.default);
}

// APIそのもの
app.get('/api/*splat', (req, res) => {
  res.send('Undefined api root');
});

// API以外にアクセスされたらindex.htmlを返す
if (process.env.NODE_ENV === 'production') {
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
  });
}

app.use(errorHandler);

// サーバー起動
app.listen(port, host, () => {
  console.log(`listening on http://${host}:${port}`);
});
