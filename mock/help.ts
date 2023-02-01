import { Request, Response } from 'express';
import { failResponse, successResponse } from './utils';

const getHistory = (req: Request, res: Response) => {
  let success = true;
  if (success) {
    res.send(
      successResponse([
        {
          id: 1,
          question: '请问您在干啥',
          answer: '我在相亲',
          sequence: 1,
        },
        {
          id: 2,
          question: '请问您贵姓',
          answer: '我在恋爱',
          sequence: 2,
        },
      ]),
    );
  } else {
    res.send(failResponse(1001, '获取帮助页信息失败'));
  }
};

export default {
  'GET /api/admin/help': getHistory,
};
