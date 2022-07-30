import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import { FormattedMessage } from 'umi';
import styles from './Welcome.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome: React.FC = () => {

  return (
    <PageContainer>
      <Card>
        <Alert
          message='这是一个不完备的首页'
          type='warning'
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>点击左侧路由访问各个页面🫲</CodePreview>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
