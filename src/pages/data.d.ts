export type PaginationParamType = {
  total: number;
  pageSize: number;
  pageIndex: number;
};

export type FacultyItem = {
  id: number,
  name: string,
  schoolId: number
}

export type ActivityItem = {
  id: number,
  name: string,
}

export type Field = {
  key: string,
  value: string,
  index: number
}

export type Fields = {
  name: string
  fields: Field[]
}

export type DailyQuestionInfo = {
  user: DailyQuestion[]
  matchUser: DailyQuestion[]
}

export type DailyQuestion = {
  like: boolean
  answer: string
  question: string
  index: number
}
