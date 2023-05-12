import { Col, Drawer, message, Row, Image, Select, Button, Tag } from 'antd';
import { ActivityItem } from '@/pages/data';
import { MatchResultItem } from '@/pages/ActivityAdmin/data';
import { useRequest } from '@@/plugin-request/request';
import { PageLoading, ProForm, ProFormInstance, ProFormTextArea } from '@ant-design/pro-components';
import { getFeedbackInfo, updateFeedbackInfo } from '@/services/activity';
import styles from './index.less';
import { useRef, useState } from 'react';

interface DailyFeedbackProps {
  activity: ActivityItem | undefined;
  values: MatchResultItem | undefined;
  visible: boolean;
  reload: () => void;
  onClose: ((e: any) => void) | undefined;
}

interface FeedbackForm {
  reason: string;
}

function code2Color(code: number) {
  let color = '#FFFFFF';
  switch (code) {
    case 0:
      color = 'warning';
      break;
    case 1:
      color = 'error';
      break;
    case 2:
      color = 'success';
      break;
    default:
      break;
  }
  return color;
}

const DailyFeedback = (props: DailyFeedbackProps) => {
  const { visible = false, onClose, values, activity, reload } = props;
  const formRef = useRef<ProFormInstance<FeedbackForm>>();
  const [_refresh,setRefresh] = useState<boolean>(false)

  const refresh = () =>{
    setRefresh(!_refresh)
  }


  const handleSubmit = async (reason: string) => {
    const data = await updateFeedbackInfo(activity?.id as number, Number(values?.id), reason);
    if (Number(data.code) === 0) {
      message.success('成功');
    }
    //onClose()
    refresh();
    reload();
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
      refreshDeps: [_refresh],
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

  const initialValues = {
    reason: "无",
  };
  if (!!feedback && feedback.reason) {
    initialValues.reason = feedback.reason;
  }

  const options = { 0: <Tag color={code2Color(0)}>未反馈</Tag> };
  if (!!feedback) {
    feedback.options.map((option) => {
      options[option.code] = <Tag color={code2Color(option.code)}>{option.description}</Tag>;
    });
  }

  return (
    <Drawer title="每日反馈详情" width={700} onClose={onClose} visible={visible}>
      <Row>
        <Col span={8} />
        <Col span={8}>{values?.name}</Col>
        <Col span={8} />
      </Row>
      <Row>
        <Col span={6} />
        <Col span={4}>{'反馈状态：'}</Col>
        <Col span={6}>{options[Number(feedback?.state.code)]}</Col>
        <Col span={8} />
      </Row>
      <Row gutter={4}>
        <Col span={4} />
        <Col>A:</Col>
        <Col>{feedback?.type?.description}</Col>
        <Col span={4} />
      </Row>
      <Row>
        {!!feedback?.type &&
          feedback.images?.map((image) => (
            <Col key={image.id} span={8}>
              <Image width={200} src={image.downloadUrl} />
            </Col>
          ))}
      </Row>
      <Row>
        <Col span={4} />
        <Col>
          <ProForm<FeedbackForm>
            formRef={formRef}
            onFinish={async () => {
              const fields = await formRef.current?.validateFieldsReturnFormatValue?.();
              if (!fields) {
                return false;
              }
              await handleSubmit(fields.reason);
              return true;
            }}
            initialValues={initialValues}
          >
            <ProFormTextArea
              name="reason"
              label="提交处理"
              placeholder="处理方式"
              required
              fieldProps={{
                maxLength: 255,
                showCount: true,
              }}
              rules={[
                {
                  required: true,
                  message: '处理方式必须填写',
                  whitespace: true,
                },
              ]}
            />
          </ProForm>
        </Col>
        <Col span={4} />
      </Row>
    </Drawer>
  );
};

export default DailyFeedback;

// 【{ values?.name }】
