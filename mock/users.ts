import {Request, Response} from 'express';
import {failResponse, successResponse} from "./utils";

const genUserList = (total: number) => {
  const ds = [];

  for (let index = 0; index < total; index++) {
    ds.push({
      activityList: [index % 7 + 1, (index + 1) % 7 + 1,],
      city: "111",
      country: "222",
      isComplete: 0,
      material: "https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/identify/logo.png?sign=bf78a98d0aedce4456a5f3680699d63f&t=1658823586",
      province: "333",
      id: index,
      nickName: `nlxm${index}`,
      realName: `rlxm${index}`,
      studentNumber: `318010${index}`,
      gender: index % 3,
      userType: index % 4,
      phoneNumber: `1888891${index}`,
      faculty: index % 48,
      identified: index % 4,
      isBlack: index % 2
    });
  }
  ds.reverse();
  return ds;
};

const userTotalNum = 200;
let userList = genUserList(userTotalNum);

const getUserGeneralInfoList = (req: Request, res: Response) => {
  let current = parseInt(req.query.pageIndex as string), pageSize = parseInt(req.query.pageSize as string)
  res.send(successResponse({
    records: userList.slice((current - 1) * pageSize, current * pageSize),
    total: userTotalNum,
    size: req.query.pageSize,
    current: req.query.pageIndex,
    pages: userTotalNum / pageSize,
  }))
}

const deleteUser = (req: Request, res: Response) => {
  let id = parseInt(req.query.id as string)
  userList = userList.filter((o) => o.id !== id)
  res.send(successResponse({
    success: true
  }))
}

const editBlackList = (req: Request, res: Response) => {
  let id = parseInt(req.query.userId as string), isBlack = parseInt(req.query.isBlack as string)
  let success = true
  userList = userList.map((o) => {
    if(o.id === id) {
      if(o.isBlack === isBlack) {
        success = false
      } else {
        o.isBlack = isBlack
      }
    }
    return o
  })

  if(success) {
    res.send(successResponse({
      success: true
    }))
  } else {
    res.send(failResponse(200, 'edit black list fail'))
  }
}


export default {
  'GET /api/admin/user/info': getUserGeneralInfoList,

  'POST /api/admin/user/blacklist': editBlackList,

  'POST /api/admin/user/delUser': deleteUser,
};
