import {DailyQuestionInfo, Fields} from "@/pages/data";

export type MatchResultItem = {
  id: string,
  name: string,
  studentNumber: string,
  gender: number,
  success: MatchSuccessInfo | undefined,
  fail: MatchFailInfo | undefined,
  surveyComplete: number,
  out: number,
  refund: number,
}

export type MatchSuccessInfo = {
  matchUserId: string,
  matchName: string,
  matchStudentNumber: string,
  answerDay: number,
  twc: number,
  twcResult: number
}

export type MatchFailInfo = {
  proportion?: number,
  reason: string,
}

export type UserMatchInfo = {
  matchInfo: {
    info: Fields[]
  },
  dailyQuestion: DailyQuestionInfo[]
}
