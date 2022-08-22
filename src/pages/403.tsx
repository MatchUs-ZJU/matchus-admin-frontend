import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const UnAccessiblePage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="没有权限访问..."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
);

export default UnAccessiblePage;
