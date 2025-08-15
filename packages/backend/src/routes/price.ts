import express from 'express';
import { typedAsyncWrapper } from '@/utils/wrappers';
import { calcPrice } from '@/utils/calcPrice';

const router = express.Router();

router.post(
  '/',
  typedAsyncWrapper<'/price', 'post'>(async (req, res) => {
    const customize = req.body.customize;

    const price = await calcPrice(customize);

    res.status(200).send({ price });
  }),
);
