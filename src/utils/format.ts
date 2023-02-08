export const getGenderText = (gender: number | undefined) => {
  if (gender === 1) {
    return '男';
  } else if (gender === 2) {
    return '女';
  } else {
    return '未选择';
  }
};

export const getUserTypeText = (userType: number | undefined) => {
  if (userType === 1) {
    return '在校生';
  } else if (userType === 2) {
    return '校友';
  } else if (userType === 3) {
    return '校友';
  } else if (userType === 4) {
    return '校友';
  } else {
    return '未选择';
  }
};
