import express, { Router } from 'express';

const router: Router = express.Router();

// パスはファイル名からの相対パス
// ここで"/"は，"/version/"を指す
router.get('/', (req, res) => {
  res.send({
    version: '2.1.0',
  });
});

export default router;
