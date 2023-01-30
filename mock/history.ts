import { Request, Response } from 'express';
import { failResponse, successResponse } from './utils';
let HistoryData = {
  id: 1,
  totalTerm: 4,
  matchs: 4,
  participants: 8000,
  unavailable: 400,
};

const editHistoryData = (req: Request, res: Response) => {
  let success = true;

  if (success) {
    res.send(
      successResponse({
        success: true,
      }),
    );
  } else {
    res.send(failResponse(1001, 'edit history data fail'));
  }
};

const getHistory = (req: Request, res: Response) => {
  let success = true;
  if (success) {
    res.send(
      successResponse({
        id: 1,
        totalTerm: 34,
        matchs: 4,
        participants: 8000,
        unavailable: 400,
      }),
    );
  } else {
    res.send(failResponse(1001, 'get history data fail'));
  }
};
export default {
  'POST /api/admin/user/info': editHistoryData,
  'GET /api/admin/mainpage/history': getHistory,
};
