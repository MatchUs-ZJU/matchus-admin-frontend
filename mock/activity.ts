import { Request, Response } from 'express';
import { failResponse, successResponse } from './utils';

const genMatchSuccessfulUserList = (total: number) => {
  const ds = [];

  for (let index = 0; index < total; index++) {
    ds.push({
      id: index,
      name: `successlxm${index}`,
      studentNumber: `318010${index}`,
      gender: index % 3,
      success: {
        matchUserId: total - 1 - index,
        matchName: `matchlxm${index}`,
        matchStudentNumber: `21222${index}`,
        answerDay: index % 5,
        twc: index % 3,
        twcResult: index % 2,
      },
      refund: index % 2,
      surveyComplete: 2,
      out: 0,
    });
  }
  ds.reverse();
  return ds;
};

const genMatchFailUserList = (total: number) => {
  const ds = [];

  for (let index = 0; index < total; index++) {
    ds.push({
      id: index,
      name: `faillxm${index}`,
      studentNumber: `318010${index}`,
      gender: index % 3,
      fail: {
        proportion: index % 10 === 0 ? undefined : Math.random() * 100,
        reason: `oeoqroisadsasadqakodckaswd121e3${index}`,
      },
      refund: index % 2,
      surveyComplete: 2,
      out: 0,
    });
  }
  ds.reverse();
  return ds;
};

const genOutUserList = (total: number) => {
  const ds = [];

  for (let index = 0; index < total; index++) {
    ds.push({
      id: index,
      name: `outlxm${index}`,
      studentNumber: `318010${index}`,
      gender: index % 3,
      refund: index % 2,
      surveyComplete: 2,
      out: 1,
    });
  }
  ds.reverse();
  return ds;
};

const genNoResultUserList = (total: number) => {
  const ds = [];

  for (let index = 0; index < total; index++) {
    ds.push({
      id: index,
      name: `noResultlxm${index}`,
      studentNumber: `318010${index}`,
      gender: index % 3,
      surveyComplete: index % 3,
      out: index % 2,
      refund: index % 2,
    });
  }
  ds.reverse();
  return ds;
};

const userTotalNum = 400;
let successList = genMatchSuccessfulUserList(userTotalNum);
let failList = genMatchFailUserList(userTotalNum / 2);
let outList = genOutUserList(userTotalNum / 4);
let noResultList = genNoResultUserList(userTotalNum * 2);

const getActivityList = (req: Request, res: Response) => {
  res.send(
    successResponse({
      activityList: [
        { id: 5, name: '第1期活动' },
        { id: 6, name: '第2期活动' },
        { id: 11, name: '第4期活动' },
        { id: 8, name: '第3期活动' },
      ],
    }),
  );
};

const getActivityMatchInfo = (req: Request, res: Response) => {
  const type = parseInt(req.query.type as string);
  const current = parseInt(req.query.pageIndex as string),
    pageSize = parseInt(req.query.pageSize as string);

  if (type === 0) {
    res.send(
      successResponse({
        records: successList.slice((current - 1) * pageSize, current * pageSize),
        total: successList.length,
        size: req.query.pageSize,
        current: req.query.pageIndex,
        pages: userTotalNum / pageSize,
      }),
    );
  } else if (type === 1) {
    res.send(
      successResponse({
        records: failList.slice((current - 1) * pageSize, current * pageSize),
        total: failList.length,
        size: req.query.pageSize,
        current: req.query.pageIndex,
        pages: userTotalNum / 2 / pageSize,
      }),
    );
  } else if (type === 2) {
    res.send(
      successResponse({
        records: outList.slice((current - 1) * pageSize, current * pageSize),
        total: outList.length,
        size: req.query.pageSize,
        current: req.query.pageIndex,
        pages: userTotalNum / 4 / pageSize,
      }),
    );
  } else if (type === 3) {
    res.send(
      successResponse({
        records: noResultList.slice((current - 1) * pageSize, current * pageSize),
        total: noResultList.length,
        size: req.query.pageSize,
        current: req.query.pageIndex,
        pages: (userTotalNum * 2) / pageSize,
      }),
    );
  } else {
    res.send(failResponse(1001, 'get activity match info fail'));
  }
};

const modifyFailReason = (req: Request, res: Response) => {
  let success = false;

  failList = failList.map((o) => {
    if (o.studentNumber === req.body.studentNumber) {
      o.fail.reason = req.body.reason;
      success = true;
    }
    return o;
  });

  if (success) {
    res.send(
      successResponse({
        success: true,
      }),
    );
  } else {
    res.send(failResponse(1001, 'modify fail reason fail'));
  }
};

const outPool = (req: Request, res: Response) => {
  let success = false;

  noResultList = noResultList.map((o) => {
    if (o.studentNumber === req.body.studentNumber) {
      o.out = req.body.out;
      outList.push(o);
      success = true;
    }
    return o;
  });

  if (success) {
    res.send(
      successResponse({
        success: true,
      }),
    );
  } else {
    res.send(failResponse(1001, 'out pool fail'));
  }
};

const modTwc = (req: Request, res: Response) => {
  let success = false;

  successList = successList.map((o) => {
    if (o.studentNumber === req.body.studentNumber) {
      o.success.twc = req.body.choice;
      success = true;
    }
    return o;
  });

  if (success) {
    res.send(
      successResponse({
        success: true,
      }),
    );
  } else {
    res.send(failResponse(1001, 'edit twc fail'));
  }
};

const getUserMatchInfo = (req: Request, res: Response) => {
  const matchInfo = {
    info: [
      {
        name: '当前状态',
        fields: [
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
        ],
      },
      {
        name: '当前状态',
        fields: [
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
        ],
      },
      {
        name: '当前状态',
        fields: [
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
        ],
      },
      {
        name: '当前状态',
        fields: [
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
        ],
      },
      {
        name: '当前状态',
        fields: [
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
          {
            key: '匹配对象状态要求',
            value: '浙大在校学生 / 毕业校友',
          },
        ],
      },
    ],
  };

  const dailyQuestions = [
    {
      index: 1,
      questions: '音乐列表第一首歌是什么',
      answer: 'NAN',
      like: true,
      matchQuestion: '音乐列表第一首歌是什么',
      matchAnswer: 'NAN',
      matchLike: false,
    },
    {
      index: 2,
      questions: '音乐列表第一首歌是什么',
      answer: 'NAN',
      like: true,
      matchQuestion: '音乐列表第一首歌是什么',
      matchAnswer: 'NAN',
      matchLike: false,
    },
    {
      index: 3,
      questions: '音乐列表第一首歌是什么',
      answer: 'NAN',
      like: true,
      matchQuestion: '音乐列表第一首歌是什么',
      matchAnswer: 'NAN',
      matchLike: false,
    },
    {
      index: 4,
      questions: '音乐列表第一首歌是什么',
      answer: 'NAN',
      like: true,
      matchQuestion: '音乐列表第一首歌是什么',
      matchAnswer: 'NAN',
      matchLike: false,
    },
  ];

  res.send(
    successResponse({
      matchInfo: matchInfo,
      dailyQuestion: dailyQuestions,
    }),
  );
};

const getHistoryActivityInfo = (req: Request, res: Response) => {
  res.send(
    successResponse([
      {
        term: 1,
        dateRange: ['2022-12-28', '2023-01-04'],
        endDate: '2023-01-20',
        endTime: '22:12:04',
        matchResultShowDate: '2023-01-26',
        matchResultShowTime: '22:12:09',
        signUpStartTime: '22:12:06',
        startDate: '2023-01-11',
        startTime: '22:12:03',
        twoWayChooseStartDate: '2023-01-18',
        twoWayChooseStartTime: '22:12:13',
        questions: ['1', '2', '1', '2', '1', '2', '1', '2'],
      },
      {
        term: 3,
        dateRange: ['2022-12-28', '2023-01-04'],
        endDate: '2023-01-20',
        endTime: '22:12:04',
        matchResultShowDate: '2023-01-26',
        matchResultShowTime: '22:12:09',
        signUpStartTime: '22:12:06',
        startDate: '2023-01-11',
        startTime: '22:12:03',
        twoWayChooseStartDate: '2023-01-18',
        twoWayChooseStartTime: '22:12:13',
        questions: ['1', '2', '1', '2', '1', '2', '1', '2'],
      },
    ]),
  );
};
export default {
  'GET /api/admin/activity/list': getActivityList,

  'GET /api/admin/activity/info': getActivityMatchInfo,

  'POST /api/admin/activity/modFailMsg': modifyFailReason,

  'POST /api/admin/activity/outPool': outPool,

  'POST /api/admin/activity/modTwc': modTwc,

  'GET /api/admin/activity/match/info': getUserMatchInfo,

  'GET /api/admin/create-activity/history': getHistoryActivityInfo,
};
