
export const stringSorter = (s1: string, s2: string) => {
  if(s1 > s2) {
    return 1
  } else if(s1 < s2) {
    return -1
  } else {
    return 0
  }
}

export const numberSorter = (s1: number, s2: number) => {
  if(s1 > s2) {
    return 1
  } else if(s1 < s2) {
    return -1
  } else {
    return 0
  }
}

export const numberFilter = (s: number, valueToFilter: string) => {
  if(s == null) {
    return false
  } else {
    return s.toString() === valueToFilter
  }
}
