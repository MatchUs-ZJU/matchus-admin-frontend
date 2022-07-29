export type MatchResultBase = {
  id: string,
  name: string,
  studentNumber: string,
}

export type MatchSuccessItem = MatchResultBase & {
  gender: number,
  matchUserId: string,
  matchName: string,
  matchStudentNumber: string,
  answerDay: number,
  twc: number,
  twcResult: number,
  refund: number
}

export type MatchFailureItem = MatchResultBase & {
  proportion: number,
  reason: string,
  refund: number,
}
