import { ProForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';

const Upload = ({ add }) => {
  return (
    <ProForm layout="horizontal" onFinish={(values) => add(values)}>
      <ProFormText width="xl" name="imageUrl" label="上传头图的链接" />
    </ProForm>
  );
};

export default Upload;
