import { Request, Response } from 'express';
import { failResponse, successResponse } from './utils';

const genUserList = (total: number) => {
  const ds = [];

  for (let index = 0; index < total; index++) {
    ds.push({
      activityList: [(index % 7) + 1, ((index + 1) % 7) + 1],
      city: '111',
      country: '222',
      isComplete: index % 2,
      material:
        'https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/person-info/3180102262-%E6%B1%AA%E7%B4%AB%E8%8F%B1-1658848350744.png?sign=63f26fb5221752ca150d312796c7e679&t=1658908882',
      province: '333',
      id: index,
      nickname: `nlxm${index}`,
      realname: `rlxm${index}`,
      luckyNumber: `49 / 50%`,
      gender: index % 3,
      userType: index % 4,
      phoneNumber: `1888891${index}`,
      faculty: index % 48,
      identified: index % 4,
      isBlack: index % 2,
      appearance: (index % 7) - 1,
      photos: [
        'https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/person-info/3180102262-%E6%B1%AA%E7%B4%AB%E8%8F%B1-1658848350744.png?sign=63f26fb5221752ca150d312796c7e679&t=1658908882',
        'https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/person-info/3180102262-%E6%B1%AA%E7%B4%AB%E8%8F%B1-1658848350744.png?sign=63f26fb5221752ca150d312796c7e679&t=1658908882',
        'https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/person-info/3180102262-%E6%B1%AA%E7%B4%AB%E8%8F%B1-1658848350744.png?sign=63f26fb5221752ca150d312796c7e679&t=1658908882',
      ],
    });
  }
  ds.reverse();
  return ds;
};

const userTotalNum = 200;
let userList = genUserList(userTotalNum);

const getUserGeneralInfoList = (req: Request, res: Response) => {
  let current = parseInt(req.query.pageIndex as string),
    pageSize = parseInt(req.query.pageSize as string);
  res.send(
    successResponse({
      records: userList.slice((current - 1) * pageSize, current * pageSize),
      total: userTotalNum,
      size: req.query.pageSize,
      current: req.query.pageIndex,
      pages: userTotalNum / pageSize,
    }),
  );
};

const deleteUser = (req: Request, res: Response) => {
  let id = parseInt(req.query.id as string);
  userList = userList.filter((o) => o.id !== id);
  res.send(
    successResponse({
      success: true,
    }),
  );
};

const editBlackList = (req: Request, res: Response) => {
  let id = parseInt(req.query.userId as string),
    isBlack = parseInt(req.query.isBlack as string);
  let success = true;
  userList = userList.map((o) => {
    if (o.id === id) {
      if (o.isBlack === isBlack) {
        success = false;
      } else {
        o.isBlack = isBlack;
      }
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
    res.send(failResponse(1001, 'edit black list fail'));
  }
};

const getUserRegisterInfoList = getUserGeneralInfoList;

const checkUser = (req: Request, res: Response) => {
  let success = true;
  if (req.body.identified !== 1 && req.body.identified !== 0) {
    success = false;
  }

  userList = userList.map((o) => {
    if (o.id === req.body.id) {
      o.identified = req.body.identified === 1 ? 3 : req.body.identified === 0 ? 2 : 1;
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
    res.send(failResponse(1001, 'check user fail'));
  }
};

const editRegisterInfo = (req: Request, res: Response) => {
  let success = false;
  userList = userList.map((o) => {
    if (o.id === req.body.id) {
      success = true;
      return {
        ...o,
        ...req.body,
      };
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
    res.send(failResponse(1001, 'edit register info fail'));
  }
};

const editAppearance = (req: Request, res: Response) => {
  let success = true;
  if (req.body.appearance === 0) {
    success = false;
  }

  userList = userList.map((o) => {
    if (o.id === req.body.userId) {
      o.appearance = req.body.appearance;
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
    res.send(failResponse(1001, 'edit user appearance fail'));
  }
};

const getUserLuckRecordRes = (req: Request, res: Response) => {
  res.send(
    successResponse({
      total: 3,
      allUserAverage: 34,
      allUserMiddle: 31,
      thisUserSum: 23,
      records: [
        {
          id: 12,
          activity: 4,
          userId: 32,
          subTotal: 54,
          sum: 23,
          isManual: true,
          updateTime: '2017-01-26 12:32:23',
        },
        {
          id: 12,
          activity: 2,
          userId: 35,
          subTotal: 6,
          sum: 25,
          isManual: true,
          updateTime: '2037-01-26 12:32:24',
        },
      ],
    }),
  );
};
export default {
  'GET /api/admin/user/info': getUserGeneralInfoList,

  'POST /api/admin/user/blacklist': editBlackList,

  'POST /api/admin/user/delUser': deleteUser,

  'GET /api/admin/register/info': getUserRegisterInfoList,

  'POST /api/admin/register/check': checkUser,

  'POST /api/admin/register/info': editRegisterInfo,

  'POST /api/admin/user/appearance': editAppearance,

  'GET /api/admin/user/lucky': getUserLuckRecordRes,
};
