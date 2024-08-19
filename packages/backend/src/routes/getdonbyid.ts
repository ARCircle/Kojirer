import express from 'express';
import prisma from '@/lib/prismaClient';
import { asyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';

const router = express.Router();

//IDが指定されなかった場合，エラーメッセージを返す．
router.get('/', asyncWrapper(async (req, res, next) => {
    throw ApiError.invalidParams;

}));

//あるIDのDonの詳細を返す
router.get('/:id', asyncWrapper(async (req, res, next) => {

    //クエリパラメータを取得．
    const id = req.params.id;

    //idが非負の整数に変換できるデータか，正規表現で検証する
    if( !/^\d+$/.test(id) ){
        throw ApiError.invalidParams();
    }

    
    //そのIDのDonを取得する
    const don = await prisma.dons.findUnique({
        where: {
            id: Number(id),
        },
    });

    //そのIDのDonがない場合，エラーを返す．
    if(!don){
        throw ApiError.internalProblems();
    }

    //とりあえずJSONで送る
    res.status(200).json(don);

}));


export default router;