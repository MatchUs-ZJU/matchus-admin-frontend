import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import styles from './index.less';
import { Button, message, Steps } from 'antd';
import Card from './Card';
import SetTime from './SetTime';
import SetTask from './SetTask';
import Upload from './Upload';

const ActivityCreation: React.FC = () => {
  const steps = [
    {
      title: '设定时间',
      content: <SetTime />,
    },
    {
      title: '设定每日任务',
      content: <SetTask />,
    },
    {
      title: '上传头像',
      content: <Upload />,
    },
  ];

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  return (
    <PageContainer>
      <div style={{ display: 'flex', overflowX: 'scroll' }}>
        <div className={styles.cardPlus}>
          <svg
            width="32"
            height="34"
            viewBox="0 0 32 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.4688 13.5928V19.0303H0.28125V13.5928H31.4688ZM18.7812 0.311523V33.4365H13V0.311523H18.7812Z"
              fill="black"
              fill-opacity="0.45"
            />
          </svg>
        </div>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      <div className={styles.steps}>
        <Steps current={current} items={items} />
        <div className={styles.content}>{steps[current].content}</div>
        <div style={{ marginTop: 24, marginLeft: '80%' }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              完成
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ActivityCreation;
