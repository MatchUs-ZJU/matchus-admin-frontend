import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ActionType, ColumnsState, ProTable } from '@ant-design/pro-table';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import {
  Radio,
  Button,
  Col,
  Divider,
  Drawer,
  Image,
  Row,
  Space,
  message,
  Alert,
  Modal,
  Dropdown,
  Menu,
  Form,
  Input,
} from 'antd';
import {
  DownOutlined,
  EditOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  DownCircleOutlined,
} from '@ant-design/icons';
import { PersonInfoItem } from '@/pages/PersonAdmin/data';
import {
  deleteUserLuck,
  getPersonalInfo,
  getUserAIScore,
  rateAppearance,
  sendVoucherInfo,
  VoucherInfo,
} from '@/services/users';
import { FAIL_MESSAGE_DURATION, SUCCESS_MESSAGE_DURATION } from '@/utils/constant';
import DescriptionItem from '@/components/DescriptionItem';
import { getGenderText, getUserTypeText } from '@/utils/format';
import { useRequest } from '@@/plugin-request/request';
import { getFacultyList } from '@/services/faculty';
import { PageLoading, ProFormInstance } from '@ant-design/pro-components';
import { numberFilter, numberSorter, stringSorter } from '@/utils/utils';
import { getActivityList } from '@/services/activity';
import { ActivityItem } from '@/pages/data';
import styles from './index.less';
import Record from './Record';
import { getUserLuckRecord, editUserLuck } from '@/services/users';
import { ProFormSelect, ProFormItem } from '@ant-design/pro-components';
import { Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';

const CustomButton = ({ onClick, buttonText }) => {
  const handleViewReason = () => {
    // TODO: 添加查看原因的逻辑
  };

  return (
    <Space style={{ marginTop: '24px' }}>
      <Button type="primary" size="large" style={{ width: '96px' }} onClick={onClick}>
        {buttonText}
      </Button>
      <Button
        type="primary"
        size="large"
        style={{ width: '96px' }}
        danger
        onClick={() => setConfirmRatingModalVisible(true)}
      >
        不符合
      </Button>
      <Button type="primary" size="large" style={{ width: '96px' }} onClick={handleViewReason}>
        查看原因
      </Button>
    </Space>
  );
};

const columnAttrList = [
  { column: '生日', dataIndex: 'birth' },
  { column: '家乡', dataIndex: 'hometown' },
  { column: '身高', dataIndex: 'height' },
  { column: '体重', dataIndex: 'weight' },
  { column: '体型', dataIndex: 'physique' },
  { column: '手机号', dataIndex: 'phoneNumber' },
  { column: '微信号', dataIndex: 'wechatNumber' },
  { column: '校区', dataIndex: 'currentSchoolCampus' },
  { column: '学历', dataIndex: 'currentSchoolStatus' },
  { column: '年级', dataIndex: 'currentSchoolGrade' },
  { column: '行业', dataIndex: 'industry' },
  { column: '是否九月毕业', dataIndex: 'schoolGraduateInSep' },
  { column: '在校生：一年内状态', dataIndex: 'oneYearStatus' },
  { column: '在校生：未来发展地', dataIndex: 'futureBase' },
  { column: '在校生：自选未来发展地', dataIndex: 'selfFutureBase' },
  { column: '气质外表', dataIndex: 'temperament' },
  { column: '兴趣爱好', dataIndex: 'interest' },
  { column: '熬夜频率', dataIndex: 'stayUpFrequency' },
  { column: '运动频率', dataIndex: 'exerciseFrequency' },
  { column: '抽烟习惯', dataIndex: 'smokingHabit' },
  { column: '蹦迪习惯', dataIndex: 'discoHabit' },
  { column: '饮酒习惯', dataIndex: 'drinkHabit' },
  { column: '参与意愿', dataIndex: 'willingness' },
  { column: '恋爱次数', dataIndex: 'loveHistory' },
  { column: '在校生：消费水平', dataIndex: 'consumption' },
  { column: '在校生：消费分担', dataIndex: 'consumptionShare' },
  { column: 'MBTI', dataIndex: 'mbti' },
  { column: '校友：学历', dataIndex: 'graduateEducation' },
  { column: '校友：工作地点', dataIndex: 'graduateWorkLocation' },
  { column: '校友：工作收入', dataIndex: 'graduateIncome' },
  { column: '校友：工作岗位', dataIndex: 'graduateWorkDetail' },
];

const getInitialColumnsState = () => {
  const result = {};
  columnAttrList.forEach((attr) => {
    result[attr.dataIndex] = {
      show: false,
    };
  });
  return result;
};

const calcScrollWidth = (columnsState: Record<string, ColumnsState>) => {
  let columnNumber = 0;
  for (const name in columnsState) {
    if (columnsState[name].show) {
      columnNumber += 1;
    }
  }
  return columnNumber * 200;
};

const sortActivityList = (activityList: ActivityItem[]) => {
  // @ts-ignore id cannot be null here
  return activityList.sort((o1, o2) => o2.id - o1.id);
};

export type luckyRecord = {
  id?: number;
  activity?: number;
  userId?: number;
  subtotal?: number;
  sum?: string;
  isManual?: boolean;
  updateTime?: string;
};
export type luckyInfoOfUser = {
  total?: number;
  allUserAverage?: number;
  allUserMiddle?: number;
  thisUserSum?: number;
  records?: luckyRecord[];
  subtotal?: number;
  reason?: string;
};
export type luckyEditInfo = {
  activityId?: number;
  reason?: string;
  subtotal?: number;
};

const PersonAdmin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [reqActivity, setReqActivity] = useState<ActivityItem | undefined>(undefined);
  const [columnsState, setColumnsState] =
    useState<Record<string, ColumnsState>>(getInitialColumnsState);

  const [ratingDrawerVisible, setRatingDrawerVisible] = useState<boolean>(false);
  const [voucherDrawerVisible, setVoucherDrawerVisible] = useState<boolean>(false);
  // const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState<boolean>(false);
  const [confirmRatingModalVisible, setConfirmRatingModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<PersonInfoItem>();
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [luckyNumberEditVisible, setluckyNumberEditVisible] = useState<boolean>(false);
  const [luckyInfo, setLuckyInfo] = useState<luckyInfoOfUser>({});
  const [AIscore, setAIscore] = useState<number>(0);

  // FETCH 学院信息
  const { loading: loading1, data: faculties } = useRequest(getFacultyList, {
    formatResult: (res) => res?.data,
  });
  // FETCH 活动列表
  // eslint-disable-next-line prefer-const
  let { loading: loading2, data: activityList } = useRequest(getActivityList, {
    formatResult: (res) => res?.data.activityList,
  });

  if (loading1 || loading2) {
    return <PageLoading />;
  }

  const handleConfirmVoucher = async () => {
    // console.log(currentRow);
    const values = await formRef.current?.validateFieldsReturnFormatValue?.();
    // console.log('校验表单并返回格式化后的所有数据：', values);
    if (!currentRow) { message.error('发送匹配券失败', FAIL_MESSAGE_DURATION); return }
    const { couponType, duration, reasonInfo } = values;
    const exchangeEndTime = moment().add(duration, 'M').format('YYYY-MM-DD');
    const data: VoucherInfo = {
      userId: currentRow.id,
      exchangeStartTime: moment().format('YYYY-MM-DD'),
      exchangeEndTime,
      reason: reasonInfo,
    };
    const response = await sendVoucherInfo(data);
    // console.log(1999, response)
    try {
      await sendVoucherInfo(data);
      message.success('发送匹配券成功', SUCCESS_MESSAGE_DURATION);
    } catch (error) {
      message.error('发送匹配券失败', FAIL_MESSAGE_DURATION);
    }
  }

  // 对活动顺序排序
  if (activityList && activityList.length) {
    activityList = sortActivityList(activityList);
  }
  // 渲染活动菜单
  const activityMenu = activityList
    ? activityList.map((item) => ({ label: item.name, key: item.id }))
    : [];
  const activityMenuForLuck = activityList
    ? activityList.map((item) => ({ label: item.name, value: item.id }))
    : [];
  activityMenu.push({ label: '所有活动', key: -1 });
  // 获取当前活动期数
  const currentReqActivity = reqActivity;

  const handleConfirmRating = async (notCorrect?: boolean) => {
    setRatingDrawerVisible(false);

    if (notCorrect) {
      const res = await rateAppearance(currentRow?.id as string, -1);
      if (!res || !res.success) {
        message.error('颜值打分失败', FAIL_MESSAGE_DURATION);
      } else {
        message.success('颜值打分成功', SUCCESS_MESSAGE_DURATION);
      }
    } else {
      if (currentRating !== 0) {
        const res = await rateAppearance(currentRow?.id as string, currentRating);
        if (!res || !res.success) {
          message.error('颜值打分失败', FAIL_MESSAGE_DURATION);
        } else {
          message.success('颜值打分成功', SUCCESS_MESSAGE_DURATION);
        }
      } else {
        message.warning('未选择颜值分数', FAIL_MESSAGE_DURATION);
      }
    }

    actionRef?.current?.reloadAndRest?.();
  };

  const handleLuckChange = async (values: luckyEditInfo) => {
    values.subtotal = Number(values.subtotal);
    console.log(values);
    const res = await editUserLuck(values, Number(currentRow.id));
    if (!res || !res.success) {
      message.error('幸运值编辑失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('幸运值编辑成功', SUCCESS_MESSAGE_DURATION);
    }
    const freshRes = await getUserLuckRecord(Number(currentRow.id));
    if (!freshRes || !freshRes.success) {
      message.error('更新幸运值记录失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('更新幸运值记录成功', SUCCESS_MESSAGE_DURATION);
    }
    setLuckyInfo(freshRes.data);
    actionRef?.current?.reloadAndRest?.();
  };
  const handleLuckDelete = async (luckyId: number) => {
    console.log(luckyId);
    const res = await deleteUserLuck(luckyId);
    if (!res || !res.success) {
      message.error('幸运值编辑撤销失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('幸运值编辑撤销成功', SUCCESS_MESSAGE_DURATION);
    }
    const freshRes = await getUserLuckRecord(Number(currentRow.id));
    if (!freshRes || !freshRes.success) {
      message.error('更新幸运值记录失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('更新幸运值记录成功', SUCCESS_MESSAGE_DURATION);
    }
    setLuckyInfo(freshRes.data);
    actionRef?.current?.reloadAndRest?.();
  };

  const columns: ProColumns<PersonInfoItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: "反馈",
      dataIndex: 'id',
      render: (_, record) => {
        console.log(record)
        return <div>"测试"</div>
      }
    },
    {
      title: '姓名',
      dataIndex: 'realname',
      fixed: 'left',
      width: 100,
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      valueEnum: {
        1: {
          text: '在校生',
          status: 'Success',
        },
        4: {
          text: '校友',
          status: 'Error',
        },
      },
      fixed: 'left',
      width: 100,
    },
    {
      title: '打分状态',
      dataIndex: 'rate',
      valueEnum: {
        '0': {
          text: '需要打分',
          status: 'Warning',
        },
        '1': {
          text: '已打分',
          status: 'Success',
        },
        '2': {
          text: '暂无照片',
        },
      },
      sorter: (o1, o2) => {
        return numberSorter(o1.rate, o2.rate);
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.rate, value as string);
      },
      fixed: 'left',
      width: 120,
    },
    {
      title: '颜值',
      dataIndex: 'appearance',
      valueEnum: {
        '-1': {
          text: '不符合',
          status: 'Error',
        },
        '0': {
          text: '未打分',
          status: 'Warning',
        },
        '1': {
          text: '前0-10%',
        },
        '2': {
          text: '前10-30%',
        },
        '3': {
          text: '前30-50%',
        },
        '4': {
          text: '前50-70%',
        },
        '5': {
          text: '前70-100%',
        },
      },
      sorter: (o1, o2) => {
        return numberSorter(o1.appearance, o2.appearance);
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.appearance, value as string);
      },
      fixed: 'left',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        0: {
          text: '未填写',
        },
        1: {
          text: '男',
        },
        2: {
          text: '女',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.gender, value as string);
      },
      fixed: 'left',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        <a
          key="rate"
          onClick={async () => {
            const res = await getUserAIScore(Number(record.id));
            if (!res || !res.success) {
              message.error('获取该用户ai打分失败', FAIL_MESSAGE_DURATION);
            } else {
              message.success('获取该用户ai打分成功', SUCCESS_MESSAGE_DURATION);
            }
            console.log(res?.data);
            setAIscore(res?.data);
            setRatingDrawerVisible(true);
            setCurrentRow(record);
          }}
        >
          打分
        </a>,
        <a
          key="more"
          onClick={() => {
            setDetailDrawerVisible(true);
            setCurrentRow(record);
          }}
        >
          详情
        </a>,
        <a
          key="voucher"
          onClick={() => {
            setCurrentRow(record)
            setVoucherDrawerVisible(true);
          }}
        >
          发券
        </a>,
      ],
    },
    {
      title: '幸运值',
      dataIndex: 'luckyValue',
      render: (_, record) => (
        <div className={styles.container}>
          <span key="rate">{`${record.luckyValue} / 前${record.luckyPercent}%`}</span>
          {'  '}

          <a
            key="more"
            className={styles.edit}
            onClick={async () => {
              const res = await getUserLuckRecord(Number(record.id));
              if (!res || !res.success) {
                message.error('获取该用户幸运值记录失败', FAIL_MESSAGE_DURATION);
              } else {
                message.success('获取该用户幸运值记录成功', SUCCESS_MESSAGE_DURATION);
              }
              console.log(res.data);
              setLuckyInfo(res.data);
              setluckyNumberEditVisible(true);
              setCurrentRow(record);
            }}
          >
            <EditOutlined />
          </a>
        </div>
      ),
    },
    {
      title: '学院',
      dataIndex: 'name',
    },
  ];

  columnAttrList.forEach((columnAttr) => {
    columns.push({
      title: columnAttr.column,
      dataIndex: columnAttr.dataIndex,
    });
  });

  const { Option } = Select;
  // couponTypeOptions
  const couponTypeOptions = [
    { label: '匹配券', value: 'matching' },
    { label: '活动券', value: 'activity' },
  ];

  // durationOptions
  const durationOptions = [
    { label: '12个月（默认）', value: '12' },
    { label: '6个月', value: '6' },
    { label: '3个月', value: '3' },
  ];



  return (
    <PageContainer>
      <Alert
        message="点击右侧齿轮，配置更多列信息内容"
        type="info"
        showIcon
        closable
        style={{ marginBottom: '16px' }}
      />
      <ProTable<PersonInfoItem>
        headerTitle="个人信息表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 'auto',
        }}
        toolbar={{
          actions: [
            <Dropdown
              key="overlay"
              overlay={
                <Menu
                  onClick={(e) => {
                    const selectedActivity = activityList?.find(
                      (item) => item.id === parseInt(e.key),
                    );
                    if (selectedActivity === undefined && currentReqActivity !== undefined) {
                      setReqActivity(undefined);
                      actionRef?.current?.reloadAndRest?.();
                    }

                    if (selectedActivity?.id !== currentReqActivity?.id) {
                      setReqActivity(activityList?.find((item) => item.id === parseInt(e.key)));
                      actionRef?.current?.reloadAndRest?.();
                    }
                  }}
                  items={activityMenu}
                />
              }
            >
              <Button>
                {currentReqActivity ? currentReqActivity.name : '所有活动'}
                <DownOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Button>
            </Dropdown>,
          ],
        }}
        request={async (params: any & API.PageParams) => {
          const res = await getPersonalInfo({
            ...params,
            activityId: currentReqActivity?.id,
            pageIndex: params.current,
            pageSize: params.pageSize,
          });
          console.log(res.data.records);
          if (res.success) {
            return {
              data: res.data.records,
              success: true,
              total: res.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
            };
          }
        }}
        postData={(data) => {
          return data.map((record) => {
            return {
              ...record,
              rate: record.rate?.toString(),
              appearance: record.appearance?.toString(),
            };
          });
        }}
        columns={columns}
        scroll={{ x: calcScrollWidth(columnsState), y: 600 }}
        columnsState={{
          value: columnsState,
          onChange: setColumnsState,
        }}
      />
      <Drawer
        title="颜值打分"
        width={600}
        onClose={() => {
          setRatingDrawerVisible(false);
          setCurrentRow(undefined);
        }}
        visible={ratingDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        afterVisibleChange={() => {
          setCurrentRating(0);
        }}
      >
        <Row>
          <Col span={24}>
            <DescriptionItem title="姓名" content={currentRow?.realname} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="ai打分" content={AIscore} />
          </Col>

          <Col span={24}>
            <DescriptionItem
              title="建议档位"
              content={
                AIscore > 70
                  ? '前0-10%'
                  : AIscore > 60
                    ? '前0-10% 或 前10-30%'
                    : AIscore > 40
                      ? '前10-30% 或 前30-50%'
                      : AIscore > 30
                        ? '前30-50% 或 前50-70% 或 前70-100%'
                        : '前70-100%'
              }
            />
          </Col>
        </Row>
        {currentRow?.photos?.map((photo) => (
          <Row style={{ marginBottom: '12px' }}>
            <Col span={24}>
              <Image style={{ height: '150px' }} src={photo} />
            </Col>
          </Row>
        ))}
        <Divider />
        {ratingDrawerVisible && (
          <Radio.Group buttonStyle="solid" onChange={(e) => setCurrentRating(e.target.value)}>
            <Radio.Button value={1}>前0-10%</Radio.Button>
            <Radio.Button value={2}>前10-30%</Radio.Button>
            <Radio.Button value={3}>前30-50%</Radio.Button>
            <Radio.Button value={4}>前50-70%</Radio.Button>
            <Radio.Button value={5}>前70-100%</Radio.Button>
          </Radio.Group>
          // <Form.Item
          // label="分值"
          // name="appearance"
          // rules={[{ required: true, message: '分值不可为空' }]}
          // >
          // <Input />
          // </Form.Item>
        )}
        <Space style={{ marginTop: '24px' }}>
          <Button
            type="primary"
            size="large"
            style={{ width: '96px' }}
            onClick={() => handleConfirmRating()}
          >
            提交
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ width: '96px' }}
            danger
            onClick={() => setConfirmRatingModalVisible(true)}
          >
            不符合
          </Button>
        </Space>
      </Drawer>
      <Drawer
        title="个人信息详情"
        width={800}
        onClose={() => {
          setDetailDrawerVisible(false);
          setCurrentRow(undefined);
        }}
        visible={detailDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Row>
          <Col span={12}>
            <DescriptionItem title="姓名" content={currentRow?.realname} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="学号" content={currentRow?.studentNumber} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="性别" content={getGenderText(currentRow?.gender)} />
          </Col>
          {/*<Col span={12}>*/}
          {/*  <DescriptionItem title="生日" content={currentRow?.birth} />*/}
          {/*</Col>*/}
          <Col span={12}>
            <DescriptionItem
              title="院系"
              content={faculties?.[(currentRow?.faculty as number) - 1]?.name}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="用户类型" content={getUserTypeText(currentRow?.userType)} />
          </Col>
        </Row>

        {columnAttrList.map((_, index) => {
          if (getUserTypeText(currentRow?.userType) == '在校生') {
            if (index % 2 == 0 && index < 27) {
              return (
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title={columnAttrList[index].column}
                      content={currentRow?.[columnAttrList[index].dataIndex] ?? '-'}
                    />
                  </Col>
                  {index !== columnAttrList.length - 1 && (
                    <Col span={12}>
                      <DescriptionItem
                        title={columnAttrList[index + 1].column}
                        content={currentRow?.[columnAttrList[index + 1].dataIndex]}
                      />
                    </Col>
                  )}
                </Row>
              );
            } else {
              return <></>;
            }
          } else if (getUserTypeText(currentRow?.userType) == '校友') {
            if (index % 2 == 0 && index < 31) {
              return (
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title={columnAttrList[index].column}
                      content={currentRow?.[columnAttrList[index].dataIndex] ?? '-'}
                    />
                  </Col>
                  {index !== columnAttrList.length - 1 && (
                    <Col span={12}>
                      <DescriptionItem
                        title={columnAttrList[index + 1].column}
                        content={currentRow?.[columnAttrList[index + 1].dataIndex]}
                      />
                    </Col>
                  )}
                </Row>
              );
            } else {
              return <></>;
            }
          }
        })}
      </Drawer>
      <Drawer
        title="发券"
        width={378}
        onClose={() => {
          setVoucherDrawerVisible(false);
        }}
        visible={voucherDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        afterVisibleChange={() => {
          setCurrentRating(0);
        }}
      >
        <ProForm submitter={false} formRef={formRef}>
          <ProFormItem
            label="优惠券类型"
            name="couponType"
            initialValue="matching"
            style={{ marginBottom: -25 }}
          >
            <ProFormSelect
              name="couponType"
              options={couponTypeOptions}
              valueEnum={{ matching: '匹配券', activity: '活动券' }}
              style={{ marginBottom: 10 }}
            />
          </ProFormItem>
          <ProFormItem label="有效期" name="duration" initialValue="12">
            <Select style={{ marginBottom: 2 }} defaultValue="12">
              {durationOptions.map((option) => (
                <Option value={option.value} key={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </ProFormItem>
          <ProFormItem label="发券原因" name="reasonInfo">
            <ProFormTextArea
              placeholder="请输入发券原因"
              style={{ height: '100px', width: '100%' }}
            />
          </ProFormItem>
          <ProFormItem>
            <Space style={{ marginTop: '24px' }}>
              <Button
                type="primary"
                size="large"
                style={{ width: '96px' }}

                onClick={() => { handleConfirmVoucher() }}
              >
                提交
              </Button>
              {/* <Button
                type="primary"
                size="large"
                style={{ width: '96px' }}
                onClick={() => handleViewReason()}
              >
                查看原因
              </Button> */}
            </Space>
          </ProFormItem>
        </ProForm>
      </Drawer>
    </PageContainer >
  )
}

export default PersonAdmin;
