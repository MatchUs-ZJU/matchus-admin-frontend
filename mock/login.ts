import {Request, Response} from "express";
import {failResponse, successResponse, waitTime} from "./utils";

export default {
  'POST /api/admin/login/': async (req: Request, res: Response) => {
    const {password, username} = req.body;
    await waitTime(2000);
    if (password === 'matchus1010' && username === 'matchus') {
      res.send(successResponse({
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTg5MjY3NDUsImlhdCI6MTY1NzYzMDc0NSwidXNlcm5hbWUiOiJtYXRjaHVzIn0.Hk-UU913pxktLa3gflPVzDwl-F7LYKYiQJ0-1mSdMys'
      }));
      return;
    }

    res.send(failResponse(1002, 'login fail'));
    return;
  },

}
