export type UserRegisterInfoItem = {
  id: string,
  nickName: string,
  realName: string,
  studentNumber: string,
  gender: number,
  userType: number,
  phoneNumber: string,
  faculty: number,
  identified: number,
  material: string,
  basicInfo: number,
  activityList: number[],
  country: string,
  province: string,
  city: string,
}

export type PersonInfoItem = {
  id: string,
  name: string,
  studentNumber: string,
  gender: number,
  birthday: string,
  downtown: string,
  height: string,
  weight: string,
  size: string,
  schoolStatus: string,
  oneYearStatus: string,
  developmentally: string,
  ownDevelopmentally: string,
  grade: string,
  phoneNumber: string,
  wxNumber: string,
  workplace: string,
  education: string,
  college: string,
  industry: string,
  position: string,
  appearance: string,
  hobbies: string,
  exercise: string,
  stayUp: string,
  drink: string,
  smoking: string,
  discoDancing: string,
  willingness: string,
  loveNumber: string,
  income: string,
  spending: string,
  MBTI: string,
  photos: string[]
}

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

export type PaginationParamType = {
  total: number;
  pageSize: number;
  pageIndex: number;
};
