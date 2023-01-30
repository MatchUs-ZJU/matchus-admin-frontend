import { Request, Response } from 'express';
import { failResponse, successResponse } from './utils';

const getTweets = (req: Request, res: Response) => {
  let success = true;
  if (success) {
    res.send(
      successResponse([
        {
          id: 1,
          title: '标题',
          description: '这是一个活动',
          tag: '活动',
          date: '2020-02',
          url: 'https://www.matchus.com',
          image:
            'https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/person-info/3180102262-%E6%B1%AA%E7%B4%AB%E8%8F%B1-1658848350744.png?sign=63f26fb5221752ca150d312796c7e679&t=1658908882',
        },
      ]),
    );
  } else {
    res.send(failResponse(1001, 'get mainpage pics fail'));
  }
};

export default {
  'GET /api/admin/mainpage/tweets': getTweets,
};
