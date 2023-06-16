import { DailyQuestionInfo, Fields } from "@/pages/data";

export type MatchResultItem = {
  id: string, ams
  name: string,
  studentNumber: string,
  gender: number,
  surveyComplete: number,
  out: number,
  refund: number,
  userType: number,
} & MatchSuccessInfo & MatchFailInfo

export type MatchSuccessInfo = {
  matchUserId: string,
  matchName: string,
  matchStudentNumber: string,
  answerDay: number,
  feedbackStatus: number,
  twc: number,
  twcResult: number,
  isTwice: boolean,
  userType: number,
  state: number
}

export type MatchFailInfo = {
  proportion?: number,
  reason: string,
  userType: number,
}

export type UserMatchInfo = {
  matchInfo: {
    info: Fields[]
  },
  dailyQuestion: DailyQuestionInfo
}

export type UserFeedbackInfo = {
  total: boolean;
  size: string;
  current: string;
  pages: string;
  records: FeedbackRecord[];
  success: boolean;
};

export type FeedbackRecord = {
  user: UserInfo;
  feedback: Feedback;
  images: Image;
};

export type UserInfo = {
  id: string;
  name: string;
  phoneNumber: string;
  gender: string;
};

export type Feedback = {
  id: string;
  user_id: string;
  opinion: string;
  image_ids: string;
  state: string;
  contact: string;
  create_time: string;
  update_time: string;
};

export type Image = {
  downloadUrl: string;
};



