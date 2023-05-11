import { Col, Drawer, message, Row, Image, Select, Button } from 'antd';
import { ActivityItem } from '@/pages/data';
import { MatchResultItem } from '@/pages/ActivityAdmin/data';
import { useRequest } from '@@/plugin-request/request';
import { PageLoading } from '@ant-design/pro-components';
import { getFeedbackInfo, updateFeedbackInfo } from '@/services/activity';
import styles from './index.less';
import { useState } from 'react';

interface DailyFeedbackProps {
  activity: ActivityItem | undefined;
  values: MatchResultItem | undefined;
  visible: boolean;
  onClose: ((e: any) => void) | undefined;
}

const DailyFeedback = (props: DailyFeedbackProps) => {
  const { visible = false, onClose, values, activity } = props;
  const [selectedValue, setSelect] = useState<number>();

  const handleSubmit = async () => {
    if (undefined == selectedValue) {
      message.warn('没有选择反馈处理方式');
      return;
    }
    if (selectedValue == 0) {
      message.warn('不能选择未提交');
      return;
    }
    const data = await updateFeedbackInfo(
      activity?.id as number,
      Number(values?.id),
      selectedValue,
    );
    if (Number(data.code) === 0) {
      message.success('成功');
    }
  };

  // FETCH 用户个人信息
  const {
    loading,
    error,
    data: feedback,
  } = useRequest(
    () => {
      return getFeedbackInfo(activity?.id as number, Number(values?.id));
    },
    {
      formatResult: (res) => res.data,
    },
  );

  if (error) {
    message.error('获取每日反馈信息信息失败');
    return <></>;
  }

  if (loading) {
    return (
      <Drawer
        title="每日反馈详情"
        width={800}
        visible={visible && loading && !error}
        onClose={onClose}
      >
        <PageLoading />
      </Drawer>
    );
  }

  let options = [{ value: 0, label: '未提交' }];
  if (!!feedback?.options) {
    options = feedback?.options.map((option) => {
      return {
        value: option.code,
        label: option.description,
      };
    });
  }

  return (
    <Drawer title="每日反馈详情" width={700} onClose={onClose} visible={visible}>
      <div className={styles.usernameContainer}>
        <div className={styles.username}>{values?.name}</div>
      </div>
      <Row>{'反馈状态：' + feedback?.state?.description}</Row>
      <Row>
        <Col>A:</Col>
        <Col>{feedback?.type?.description}</Col>
      </Row>
      <Row>
        {!!feedback?.type &&
          feedback.images?.map((image) => (
            <Col key={image.id} span={8}>
              <Image width={200} src={image.downloadUrl} />
            </Col>
          ))}
      </Row>
      <Select
        options={options}
        onChange={(value) => {
          setSelect(value);
        }}
      />
      <Button onClick={handleSubmit}>{'提交'}</Button>
    </Drawer>
  );
};

export default DailyFeedback;

// 【{ values?.name }】
