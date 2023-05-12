import { FormInstance, ProForm, ProFormText } from '@ant-design/pro-components';
import React, { useEffect, useRef } from 'react';

const Upload = ({ add, activity }) => {
  const formRef = useRef<FormInstance>(null);
  useEffect(() => {
    formRef && formRef.current && formRef.current.resetFields();
  }, [activity]);

  let formActivity = {};
  if (!!activity) {
    formActivity['imageUrl'] = activity.imageUrl;
  }

  return (
    <ProForm
      formRef={formRef}
      layout="horizontal"
      onFinish={(values) => add(values)}
      initialValues={formActivity}
    >
      <ProFormText width="xl" name="imageUrl" label="上传头图的链接" />
    </ProForm>
  );
};

export default Upload;
