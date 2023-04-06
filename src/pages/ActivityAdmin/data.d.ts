import {DailyQuestionInfo, Fields} from "@/pages/data";

export type MatchResultItem = {
  id: string,
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
  twc: number,
  twcResult: number,
  isTwice: boolean,
  userType: number,
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
