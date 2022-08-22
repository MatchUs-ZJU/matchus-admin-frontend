export function successResponse(data: any) {
  return {
    success: true,
    code: 0,
    msg: 'success',
    data: data
  }
}

export function failResponse(code: number, msg: string) {
  return {
    success: false,
    code: code,
    msg: msg,
    data: undefined
  }
}

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
