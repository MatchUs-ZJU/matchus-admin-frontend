import { ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import React from 'react';

const Upload = () => {
  return (
    <ProFormUploadButton
      name="Upload"
      max={1}
      fieldProps={{
        name: 'file',
        listType: 'picture-card',
      }}
      action="/upload.do"
    />
  );
};

export default Upload;
