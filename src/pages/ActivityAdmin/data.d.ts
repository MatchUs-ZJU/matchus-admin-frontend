import {DailyQuestionInfo, Fields} from "@/pages/data";

export type MatchResultItem = {
  id: string,
  name: string,
  studentNumber: string,
  gender: number,
  surveyComplete: number,
  out: number,
  refund: number,
} & MatchSuccessInfo & MatchFailInfo

export type MatchSuccessInfo = {
  matchUserId: string,
  matchName: string,
  matchStudentNumber: string,
  answerDay: number,
  twc: number,
  twcResult: number
  isTwice: boolean
}

export type MatchFailInfo = {
  proportion?: number,
  reason: string,
}

export type UserMatchInfo = {
  matchInfo: {
    info: Fields[]
  },
  dailyQuestion: DailyQuestionInfo
}
