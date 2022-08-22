import {Request, Response} from "express";
import {failResponse, successResponse, waitTime} from "./utils";

export default {
  'POST /api/admin/login/': async (req: Request, res: Response) => {
    const {password, username} = req.body;
    await waitTime(2000);
    if (password === 'matchus1010' && username === 'matchus') {
      res.send(successResponse({
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjAyOTM4OTMsImlhdCI6MTY1ODk5Nzg5MywidXNlcm5hbWUiOiJtYXRjaHVzIn0.behDB5T9LYcovbLQO-EF-sTkOAuUE-5m9KwPWbtVOdE'
      }));
      return;
    }

    res.send(failResponse(1002, 'login fail'));
    return;
  },

}
