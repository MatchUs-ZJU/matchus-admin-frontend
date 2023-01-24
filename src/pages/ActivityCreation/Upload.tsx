import { ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import React from 'react';

const Upload = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ProForm>
        <ProFormUploadButton
          name="Upload"
          label="上传头图"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
          }}
          action="/upload.do"
        />
      </ProForm>
    </div>
  );
};

export default Upload;
