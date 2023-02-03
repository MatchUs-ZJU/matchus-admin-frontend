import { ProForm, ProFormText } from '@ant-design/pro-components';

import React from 'react';

const SetTask = ({ add }) => {
  return (
    <ProForm layout="horizontal" onFinish={(values) => add(values)}>
      <ProFormText width="xl" name="day1" label="男问女 - Day1" />
      <ProFormText width="xl" name="day2" label="男问女 - Day2" />
      <ProFormText width="xl" name="day3" label="男问女 - Day3" />
      <ProFormText width="xl" name="day4" label="男问女 - Day4" />
      <ProFormText width="xl" name="day5" label="女问男 - Day1" />
      <ProFormText width="xl" name="day6" label="女问男 - Day2" />
      <ProFormText width="xl" name="day7" label="女问男 - Day3" />
      <ProFormText width="xl" name="day8" label="女问男 - Day4" />
    </ProForm>
  );
};

export default SetTask;
