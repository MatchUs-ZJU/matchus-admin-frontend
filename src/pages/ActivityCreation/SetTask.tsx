import { ProForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';

const SetTask = () => {
  return (
    <ProForm layout="horizontal">
      <ProFormText width="xl" name="name" label="男问女 - Day1" />
      <ProFormText width="xl" name="name" label="男问女 - Day2" />
      <ProFormText width="xl" name="name" label="男问女 - Day3" />
      <ProFormText width="xl" name="name" label="男问女 - Day4" />
      <ProFormText width="xl" name="name" label="女问男 - Day1" />
      <ProFormText width="xl" name="name" label="女问男 - Day2" />
      <ProFormText width="xl" name="name" label="女问男 - Day3" />
      <ProFormText width="xl" name="name" label="女问男 - Day4" />
    </ProForm>
  );
};

export default SetTask;
