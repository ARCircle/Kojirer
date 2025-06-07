import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const port = 52600;

// 各種モジュールをインポート
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'web')));
app.use(cors());

// routesのファイル名の配列を取得
const filenames = fs.readdirSync(path.join(__dirname, 'routes'));

// ファイル名ごとにrouteを動的インポート
for (const filename of filenames) {
  const name = filename.replace('.js', '');
  const route_path = `${__dirname}/routes/${name}.js`;
  const route = require(route_path);

  app.use(`/api/${name}`, route.default);
}

// APIそのもの
app.get('/api/*', (req, res) => {
  res.send('Undefined api root');
});

// API以外にアクセスされたらindex.htmlを返す
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.use(errorHandler);

// ポート開放
app.listen(port);
console.log(`Opened http://localhost:${port}/`);
