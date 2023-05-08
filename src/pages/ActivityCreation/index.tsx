import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, message, Steps } from 'antd';
import Card from './Card';
import SetTime from './SetTime';
import SetTask from './SetTask';
import Upload from './Upload';
import { FAIL_MESSAGE_DURATION, SUCCESS_MESSAGE_DURATION } from '@/utils/constant';
import { publishActivity } from '@/services/activity';
import { getHistoryActivity } from '@/services/activity';
import { deleteActivity } from '@/services/activity';
import { useRequest } from 'umi';

export type activity = {
  term?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  signUpStartTime?: string;
  signUpStartDate?: string;
  signUpEndTime?: string;
  signUpEndDate?: string;
  matchResultShowDate?: string;
  matchResultShowTime?: string;
  twoWayChooseStartDate?: string;
  twoWayChooseStartTime?: string;
  twoWayChooseEndDate?: string;
  twoWayChooseEndTime?: string;
  imageUrl?: string;
  questions?: string[];
};
const ActivityCreation: React.FC = () => {
  const [activityCreationVisible, setActivityCreationVisible] = useState<boolean>(false);
  const [activityContent, setActivityContent] = useState<activity>({});
  const [historyActivity, setHistoryActivity] = useState<activity[]>([]);

  useEffect(() => {
    getHistoryActivity()
      .then((res) => res.data)
      .then((data) => setHistoryActivity(data.data));
  }, []);

  const handleFinishPublish = async () => {
    console.log(activityContent);
    const res = await publishActivity(activityContent);

    if (!res || !res.success) {
      message.error('创建活动失败', FAIL_MESSAGE_DURATION);
      const actRes = await getHistoryActivity();
      setHistoryActivity(actRes.data.data);
    } else {
      message.success('创建活动成功', SUCCESS_MESSAGE_DURATION);
      const actRes = await getHistoryActivity();
      setHistoryActivity(actRes.data.data);
    }
  };
  console.log(historyActivity);
  const addNewActivity = () => {
    setActivityCreationVisible(true);
  };

  const handleDeleteActivity = async (term: number) => {
    const res = await deleteActivity(term);
    if (!res || !res.success) {
      message.error('活动删除失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('活动删除成功', SUCCESS_MESSAGE_DURATION);
    }
    getHistoryActivity()
      .then((response) => response.data)
      .then((data) => setHistoryActivity(data.data));
  };

  const addTimeToActivity = (values: activity) => {
    setActivityContent((preContent) => {
      const newContent = {
        ...values,
        ...preContent,
      };
      newContent.startDate = newContent.dateRange[0];
      newContent.endDate = newContent.dateRange[1];
      newContent.startTime = '00:00:01';
      newContent.endTime = '23:59:59';
      delete newContent.dateRange;
      console.log(newContent);
      return newContent;
    });
  };
  const addContentToActivity = (values: activity) => {
    setActivityContent((preContent) => {
      if (values.term) {
        values.term = values.term;
      }
      const newContent = {
        ...values,
        ...preContent,
      };
      console.log(newContent);
      return newContent;
    });
  };
  const addQuestionsToActivity = (values: any) => {
    const questions = Object.values(values);
    console.log(questions);
    setActivityContent((preContent) => {
      const newContent = {
        questions: questions as string[],
        ...preContent,
      };
      console.log(newContent);
      return newContent;
    });
  };
  const steps = [
    {
      title: '设定时间',
      content: <SetTime add={addTimeToActivity} />,
    },
    {
      title: '设定每日任务',
      content: <SetTask add={addQuestionsToActivity} />,
    },
    {
      title: '上传头像',
      content: <Upload add={addContentToActivity} />,
    },
  ];
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <PageContainer>
      <div
        style={{
          display: 'flex',
          overflowX: 'scroll',
        }}
      >
        <div className={styles.cardPlus} onClick={addNewActivity}>
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
              fillOpacity="0.45"
            />
          </svg>
        </div>
        {historyActivity.map((activity) => (
          <Card key={activity.term} {...activity} editActivity={addNewActivity} />
        ))}
      </div>

      {activityCreationVisible ? (
        <div className={styles.steps}>
          <Steps current={current} items={items} />
          <div className={styles.content}>{steps[current].content}</div>
          <div
            style={{
              marginTop: 24,
              marginLeft: '80%',
            }}
          >
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={handleFinishPublish}>
                完成
              </Button>
            )}
            {current > 0 && (
              <Button
                style={{
                  margin: '0 8px',
                }}
                onClick={() => prev()}
              >
                上一步
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.tips}>点击上方加号新建活动哟</div>
      )}
    </PageContainer>
  );
};

export default ActivityCreation;
