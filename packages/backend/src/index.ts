import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from '@/utils/logger';
import { WebSocketDonChannel } from './websocket/donChannel';
import { Don } from './websocket/messages';
import { WebSocketServer } from 'ws';

const app = express();

// ===== 設定 =====
const port = Number(process.env.PORT ?? 52600);
const host = process.env.HOST ?? '0.0.0.0';

// 各種モジュールをインポート
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'web')));
app.use(cors());

// リクエストログ
app.use((req, res, next) => {
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// routesのファイル名の配列を取得
const filenames = fs.readdirSync(path.join(__dirname, 'routes'));

// ファイル名ごとにrouteを動的インポート
for (const filename of filenames) {
  if (!filename.endsWith('.js')) continue;
  const name = filename.replace('.js', '');
  const route_path = `${__dirname}/routes/${name}.js`;
  const route = require(route_path);

  app.use(`/api/${name}`, route.default);
}

// ヘルスチェック
app.get('/healthz', (_req, res) => res.status(200).send('ok'));
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
const server = app.listen(port, host, () => {
  logger.info('Server started', {
    host,
    port,
    environment: process.env.NODE_ENV || 'development',
  });
});

// WebSocketサーバー
const wss = new WebSocketServer({ port: 52601 });
const donChannel = new WebSocketDonChannel({ wss });
logger.info('WebSocket server started on ws://localhost:52601');

// 5秒ごとに通知をテスト送信
setInterval(() => {
  logger.info('Sending notification to active clients...');
  const exampleDonState: Don[] = [
    { id: '1', state: 'ordered' },
    { id: '2', state: 'cooking' },
  ];
  donChannel.notifyActiveDonState(exampleDonState);
}, 5000);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
