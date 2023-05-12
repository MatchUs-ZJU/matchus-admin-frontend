import React, { useRef, useState } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import type { ActivityItem } from '@/pages/data';
import { Button, Menu, Dropdown, Radio, Tag, Drawer, Select, message, Popconfirm } from 'antd';
import { DownOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { MatchResultItem } from '@/pages/ActivityAdmin/data';
import { useRequest } from '@@/plugin-request/request';
import { Modal, Upload } from 'antd';
import {
  editTwc,
  getActivityList,
  getActivityMatchInfo,
  modifyFailReason,
  modifySurveyState,
  outPool,
  refundOne,
} from '@/services/activity';
import {
  Space,
} from 'antd';
import { PageLoading } from '@ant-design/pro-components';
import {
  CHOOSE,
  FAIL_MESSAGE_DURATION,
  NOT_CHOOSE,
  SUCCESS_MESSAGE_DURATION,
} from '@/utils/constant';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import MatchDetail from '@/pages/ActivityAdmin/MatchDetail';
import DailyFeedback from '@/pages/ActivityAdmin/Feedback';
import DailyQuestions from '@/pages/ActivityAdmin/DailyQuestions';
import { numberFilter, numberSorter, stringSorter } from '@/utils/utils';
import styles from './index.less';
import { getExportedExample, getExportedTable } from '@/services/activity';
import { uploadFile } from '@/services/activity';
import UserInfo from './UserInfo';
import { getFacultyList } from '@/services/faculty';
import { ProFormInstance } from '@ant-design/pro-components';
import { ProFormSelect, ProFormItem } from '@ant-design/pro-components';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import moment from 'moment';
import {
  deleteUserLuck,
  getPersonalInfo,
  getUserAIScore,
  rateAppearance,
  sendVoucherInfo,
  VoucherInfo,
} from '@/services/users';

const MatchSuccessType = 0,
  MatchFailType = 1,
  MatchOutType = 2,
  MatchNoResultType = 3;
const IN_POOL = 0,
  OUT_POOL = 1;
const FILLED = 1,
  NOT_FILLED = 0;

const sortActivityList = (activityList: ActivityItem[]) => {
  return activityList.sort((o1, o2) => o2.id - o1.id);
};

const ActivityAdmin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [reqType, setReqType] = useState<number>(MatchSuccessType);
  const [reqActivity, setReqActivity] = useState<ActivityItem | undefined>(undefined);
  const [modifyReasonDrawerVisible, setModifyReasonDrawerVisible] = useState<boolean>(false);
  const [matchDetailDrawerVisible, setMatchDetailDrawerVisible] = useState<boolean>(false);
  const [dailyFeedbackDrawerVisible, setDailyFeedbackDrawerVisible] = useState<boolean>(false);
  const [dailyQuestionDrawerVisible, setDailyQuestionDrawerVisible] = useState<boolean>(false);
  const [userInfoDrawerVisible, setUserInfoDrawerVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MatchResultItem | undefined>(undefined);
  const [failReason, setFailReason] = useState<string>('');
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [queryId, setQueryId] = useState<string>('');
  const [voucherDrawerVisible, setVoucherDrawerVisible] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();
  const [currentRating, setCurrentRating] = useState<number>(0);

  const { loading: loading1, data: faculties } = useRequest(getFacultyList, {
    formatResult: (res) => res?.data,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRefundModalOk = async (activityId: number, userId: number) => {
    const refund = async () => {
      const result = await refundOne(activityId, userId);
      console.log(result);
      if (!!result && result.data.success) {
        message.success('提交退款成功');
      }
    };
    await refund();
    setIsRefundModalOpen(false);
    actionRef.current?.reload()
  };

  const showRefundModal = (record: MatchResultItem) => {
    setCurrentRow(record);
    setIsRefundModalOpen(true);
  };

  //发送匹配券
  const { Option } = Select;

  const couponTypeOptions = [
    { label: '匹配券', value: 'matching' },
    { label: '活动券', value: 'activity' },
  ];

  const durationOptions = [
    { label: '12个月（默认）', value: '12' },
    { label: '6个月', value: '6' },
    { label: '3个月', value: '3' },
  ];

  const handleConfirmVoucher = async () => {
    // console.log(currentRow);
    const values = await formRef.current?.validateFieldsReturnFormatValue?.();
    // console.log('校验表单并返回格式化后的所有数据：', values);
    if (!currentRow) {
      message.error('发送匹配券失败', FAIL_MESSAGE_DURATION);
      return;
    }
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
  };

  // 加载活动列表
  // eslint-disable-next-line prefer-const
  let { loading, data: activityList } = useRequest(getActivityList, {
    formatResult: (res) => res?.data.activityList,
  });

  if (loading) {
    return <PageLoading />;
  }

  // 对活动顺序排序
  if (activityList && activityList.length) {
    activityList = sortActivityList(activityList);
  }
  // 渲染活动菜单
  const activityMenu = activityList
    ? activityList.map((item) => ({ label: item.name, key: item.id }))
    : [];
  // 获取当前活动期数
  const currentReqActivity = reqActivity ?? activityList?.at(0);

  const handleDowndloadExample = async () => {
    const res = await getExportedExample();
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = '示例表格.xls';
    link.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const res = await uploadFile(currentReqActivity?.id, file);
    console.log(res);
    if (!res || !res.success) {
      message.error('上传文件失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('上传文件成功', SUCCESS_MESSAGE_DURATION);
    }
  };
  const handleExportData = async () => {
    console.log(currentReqActivity?.id);
    const res = await getExportedTable(currentReqActivity?.id);
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${currentReqActivity?.name}匹配信息.xls`;
    link.click();
  };

  const handleConfirmModifyReason = async () => {
    setModifyReasonDrawerVisible(false);
    const res = await modifyFailReason(
      currentReqActivity?.id as number,
      currentRow?.studentNumber as string,
      failReason,
    );
    if (!res || !res.success) {
      message.error('编辑匹配失败原因失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('编辑匹配失败原因成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.();
  };

  const handleModifySurveyState = async (filled: number, record: MatchResultItem) => {
    const res = await modifySurveyState(
      currentReqActivity?.id as number,
      record.id as string,
      filled,
    );
    if (!res || !res.success) {
      message.error('修改问卷状态失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('修改问卷状态成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.();
  };

  const handleOutPool = async (out: number, record: MatchResultItem) => {
    const res = await outPool(
      currentReqActivity?.id as number,
      record.studentNumber as string,
      record.id as string,
      out,
    );
    if (!res || !res.success) {
      message.error('出/入库失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('出/入库成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.();
  };

  const handleEditTwc = async (choice: number, record: MatchResultItem) => {
    const res = await editTwc(
      currentReqActivity?.id as number,
      record.studentNumber as string,
      choice,
    );
    if (!res || !res.success) {
      message.error('修改双选操作失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('修改双选操作成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.();
  };

  // 获取表格信息
  const fetchTableInfo = async (params: any & API.PageParams) => {
    const res = await getActivityMatchInfo({
      ...params,
      type: reqType,
      activityId: currentReqActivity?.id,
      pageIndex: params.current,
      pageSize: params.pageSize,
    });

    if (res && res.success) {
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
  };

  // 匹配成功表格信息
  const successfulColumns: ProColumns<MatchResultItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => {
        return stringSorter(o1.studentNumber, o2.studentNumber);
      },
      sortOrder: sortedInfo.columnKey === 'studentNumber' ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.gender || null,
    },
    {
      title: '用户类别',
      dataIndex: 'userType',
      valueEnum: {
        1: {
          text: '在校生',
        },
        4: {
          text: '校友',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.userType, value as string);
      },
      filteredValue: filteredInfo.userType || null,
    },
    {
      title: '匹配对象',
      dataIndex: 'matchName',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '是否二次匹配',
      dataIndex: 'isTwice',
      valueEnum: {
        0: {
          text: '否',
          status: 'Error',
        },
        1: {
          text: '是',
          status: 'Success',
        },
      },
    },
    {
      title: '回答天数',
      dataIndex: 'answerDay',
      valueEnum: {
        0: {
          text: '未回答',
        },
        1: {
          text: '1天',
        },
        2: {
          text: '2天',
        },
        3: {
          text: '3天',
        },
        4: {
          text: '4天',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.answerDay, value as string);
      },
      filteredValue: filteredInfo.answerDay || null,
    },
    {
      title: '反馈状态',
      dataIndex: 'state',
      valueEnum: {
        0: {
          text: <Tag color="warning">未提交</Tag>,
        },
        1: {
          text: <Tag color="error">未处理</Tag>,
        },
        2: {
          text: <Tag color="success">已处理</Tag>,
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return record.state === value;
      },
      filteredValue: filteredInfo.state || null,
    },
    {
      title: '双选操作',
      dataIndex: 'twc',
      valueEnum: {
        0: {
          text: '未选择',
          status: 'Error',
        },
        1: {
          text: '选他/她',
          status: 'Success',
        },
        2: {
          text: '不选他/她',
          status: 'Warning',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.twc, value as string);
      },
      filteredValue: filteredInfo.twc || null,
    },
    {
      title: '双选结果',
      dataIndex: 'twcResult',
      valueEnum: {
        0: {
          text: <Tag color="error">失败</Tag>,
        },
        1: {
          text: <Tag color="success">成功</Tag>,
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.twcResult, value as string);
      },
      filteredValue: filteredInfo.twcResult || null,
    },
    {
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error',
        },
        1: {
          text: '已退款',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.refund, value as string);
      },
      filteredValue: filteredInfo.refund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="userInfo"
          onClick={() => {
            setQueryId(record.id);
            console.log(record.id);
            setUserInfoDrawerVisible(true);
          }}
        >
          用户信息
        </a>,
        <a
          key="matchUserInfo"
          onClick={() => {
            setQueryId(record.matchUserId);
            console.log(record.matchUserId);
            setUserInfoDrawerVisible(true);
          }}
        >
          匹配对象信息
        </a>,
        <a
          key="matchDetail"
          onClick={() => {
            setCurrentRow(record);
            setMatchDetailDrawerVisible(true);
          }}
        >
          匹配信息
        </a>,
        <a
          key="dailyFeedback"
          onClick={() => {
            setCurrentRow(record);
            setDailyFeedbackDrawerVisible(true);
          }}
        >
          每日反馈
        </a>,
        <a
          key="dailyQuestion"
          onClick={() => {
            setCurrentRow(record);
            setDailyQuestionDrawerVisible(true);
          }}
        >
          每日一问
        </a>,
        <Popconfirm
          key={record.id}
          title="确认将双选操作改为?"
          onConfirm={async () => {
            await handleEditTwc(CHOOSE, record);
          }}
          onCancel={async () => {
            await handleEditTwc(NOT_CHOOSE, record);
          }}
          okText="选他/她"
          cancelText="不选他/她"
        >
          <a key="editTwc">修改双选操作</a>
        </Popconfirm>,
        <a
          key="refund"
          onClick={() => {
            console.log('refund');
            showRefundModal(record);
          }}
        >
          <span style={{ color: '#808080' }}>退款</span>
        </a>,
        <a
          key="voucher"
          onClick={() => {
            setCurrentRow(record);
            setVoucherDrawerVisible(true);
          }}
          style={{ color: 'rgb(128, 128, 128)' }}
        >
          发券
        </a >
      ],
    },
  ];
  // 匹配失败表格信息
  const failColumns: ProColumns<MatchResultItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => {
        return stringSorter(o1.studentNumber, o2.studentNumber);
      },
      sortOrder: sortedInfo.columnKey === 'studentNumber' ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.gender || null,
    },
    {
      title: '用户类别',
      dataIndex: 'userType',
      valueEnum: {
        1: {
          text: '在校生',
        },
        4: {
          text: '校友',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.userType, value as string);
      },
      filteredValue: filteredInfo.userType || null,
    },
    {
      title: '匹配人数比例',
      dataIndex: 'proportion',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, item) => {
        return `${item.proportion !== undefined ? Math.round(item.proportion) : 'NaN'}%`;
      },
      sorter: (o1, o2) => {
        return numberSorter(o1.proportion!, o2.proportion!);
      },
      sortOrder: sortedInfo.columnKey === 'proportion' ? sortedInfo.order : null,
    },
    {
      title: '失败原因',
      dataIndex: 'reason',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error',
        },
        1: {
          text: '已退款',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.refund, value as string);
      },
      filteredValue: filteredInfo.refund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="modifyReason"
          onClick={() => {
            setModifyReasonDrawerVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="refund"
          onClick={() => {
            console.log('refund');
            showRefundModal(record);
          }}
        >
          <span style={{ color: '#808080' }}>退款</span>
        </a>,
      ],
    },
  ];
  // 出库用户表格信息
  const outColumns: ProColumns<MatchResultItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => {
        return stringSorter(o1.studentNumber, o2.studentNumber);
      },
      sortOrder: sortedInfo.columnKey === 'studentNumber' ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.gender || null,
    },
    {
      title: '用户类别',
      dataIndex: 'userType',
      valueEnum: {
        1: {
          text: '在校生',
        },
        4: {
          text: '校友',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.userType, value as string);
      },
      filteredValue: filteredInfo.userType || null,
    },
    {
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error',
        },
        1: {
          text: '已退款',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.refund, value as string);
      },
      filteredValue: filteredInfo.refund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="refund"
          onClick={() => {
            console.log('refund');
            showRefundModal(record);
          }}
        >
          <span style={{ color: '#808080' }}>退款</span>
        </a>,
      ],
    },
  ];
  // 匹配结果未出表格信息
  const noResultColumns: ProColumns<MatchResultItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => {
        return stringSorter(o1.studentNumber, o2.studentNumber);
      },
      sortOrder: sortedInfo.columnKey === 'studentNumber' ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.gender || null,
    },
    {
      title: '用户类别',
      dataIndex: 'userType',
      valueEnum: {
        1: {
          text: '在校生',
        },
        4: {
          text: '校友',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.userType, value as string);
      },
      filteredValue: filteredInfo.userType || null,
    },
    {
      title: '问卷填写',
      dataIndex: 'surveyComplete',
      valueEnum: {
        0: {
          text: '未填写',
          status: 'Error',
        },
        1: {
          text: '已完成',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.surveyComplete, value as string);
      },
      filteredValue: filteredInfo.surveyComplete || null,
    },
    {
      title: '参与/是否出库',
      dataIndex: 'out',
      valueEnum: {
        1: {
          text: '出库',
          status: 'Error',
        },
        0: {
          text: '参与',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.out, value as string);
      },
      filteredValue: filteredInfo.out || null,
    },
    {
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error',
        },
        1: {
          text: '已退款',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.refund, value as string);
      },
      filteredValue: filteredInfo.refund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="matchDetail"
          onClick={() => {
            setCurrentRow(record);
            setMatchDetailDrawerVisible(true);
          }}
        >
          匹配信息
        </a>,
        <a
          key="out"
          onClick={async () => {
            setCurrentRow(record);
            await handleOutPool(record.out === IN_POOL ? OUT_POOL : IN_POOL, record);
          }}
        >
          {`${record.out === IN_POOL ? '出' : '入'}库`}
        </a>,
        <a
          key="survey"
          onClick={async () => {
            setCurrentRow(record);
            await handleModifySurveyState(
              record.surveyComplete === NOT_FILLED ? FILLED : NOT_FILLED,
              record,
            );
          }}
        >
          <span style={{ color: '#808080' }}>修改问卷状态</span>
        </a>,
        <a
          key="refund"
          onClick={() => {
            console.log('refund');
          }}
        >
          <span style={{ color: '#808080' }}>退款</span>
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<MatchResultItem>
        headerTitle="活动信息表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 'auto',
        }}
        toolbar={{
          filter: (
            <Radio.Group
              buttonStyle="solid"
              value={reqType}
              onChange={(e) => {
                setReqType(e.target.value);
                setFilteredInfo({});
                setSortedInfo({});
                actionRef?.current?.reloadAndRest?.();
              }}
            >
              <Radio.Button value={MatchNoResultType}>报名用户</Radio.Button>
              <Radio.Button value={MatchOutType}>出库用户</Radio.Button>
              <Radio.Button value={MatchSuccessType}>匹配成功</Radio.Button>
              <Radio.Button value={MatchFailType}>匹配失败</Radio.Button>
            </Radio.Group>
          ),
          actions: [
            <Dropdown
              key="overlay"
              overlay={
                <Menu
                  onClick={(e) => {
                    const selectedActivity = activityList?.find(
                      (item) => item.id === parseInt(e.key),
                    );
                    console.log(selectedActivity);
                    if (selectedActivity?.id !== currentReqActivity?.id) {
                      setReqActivity(activityList?.find((item) => item.id === parseInt(e.key)));
                      actionRef?.current?.reloadAndRest?.();
                    }
                  }}
                  items={activityMenu}
                />
              }
            >
              <Button key="activity">
                {currentReqActivity ? currentReqActivity.name : '选择活动'}
                <DownOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Button>
            </Dropdown>,
            <Button onClick={showModal}>导入数据</Button>,
            <Button
              icon={<DownloadOutlined />}
              key="export"
              type="primary"
              onClick={() => handleExportData()}
            >
              导出数据
            </Button>,
          ],
        }}
        onChange={(_, filters, sorter) => {
          setFilteredInfo(filters);
          setSortedInfo(sorter as SorterResult<any>);
        }}
        request={fetchTableInfo}
        columns={
          reqType === MatchSuccessType
            ? successfulColumns
            : reqType === MatchFailType
              ? failColumns
              : reqType === MatchOutType
                ? outColumns
                : noResultColumns
        }
      />
      {userInfoDrawerVisible && (
        <UserInfo
          visible={userInfoDrawerVisible}
          onClose={() => {
            setUserInfoDrawerVisible(false);
            setCurrentRow(undefined);
          }}
          id={queryId}
          faculties={faculties}
        //values={currentRow}
        />
      )}
      {matchDetailDrawerVisible && (
        <MatchDetail
          visible={matchDetailDrawerVisible}
          onClose={() => {
            setMatchDetailDrawerVisible(false);
            setCurrentRow(undefined);
          }}
          activity={currentReqActivity}
          values={currentRow}
        />
      )}
      {dailyFeedbackDrawerVisible && (
        <DailyFeedback
          visible={dailyFeedbackDrawerVisible}
          onClose={() => {
            setDailyFeedbackDrawerVisible(false);
            setCurrentRow(undefined);
          }}
          activity={currentReqActivity}
          values={currentRow}
          reload={() => {
            actionRef.current?.reload();
          }}
        />
      )}
      {dailyQuestionDrawerVisible && (
        <DailyQuestions
          visible={dailyQuestionDrawerVisible}
          onClose={() => {
            setDailyQuestionDrawerVisible(false);
            setCurrentRow(undefined);
          }}
          activity={currentReqActivity}
          values={currentRow}
        />
      )}
      <Drawer
        title="修改失败理由"
        width={400}
        onClose={() => {
          setModifyReasonDrawerVisible(false);
          setCurrentRow(undefined);
          setFailReason('');
        }}
        afterVisibleChange={() => {
          setFailReason('');
        }}
        visible={modifyReasonDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {modifyReasonDrawerVisible && (
          <Select
            placeholder="请选择失败理由"
            style={{ width: '300px' }}
            onChange={(v) => setFailReason(v)}
          >
            <Select.Option value="条件匹配人数过少">条件匹配人数过少</Select.Option>
            <Select.Option value="注册信息审核不通过">注册信息审核不通过</Select.Option>
            <Select.Option value="其它">其它</Select.Option>
          </Select>
        )}
        <Button
          size="large"
          type="primary"
          style={{ marginTop: '24px' }}
          onClick={handleConfirmModifyReason}
        >
          确认
        </Button>
      </Drawer>
      <Modal title="上传数据" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className={styles.buttons}>
          <input onChange={(e) => handleUpload(e)} className={styles.upload} type="file" />
          <Button icon={<DownloadOutlined />} onClick={handleDowndloadExample}>
            下载示例文件
          </Button>
        </div>
      </Modal>
      <Modal
        title="确认退款"
        open={isRefundModalOpen}
        onOk={() => {
          handleRefundModalOk(currentReqActivity.id, Number(currentRow?.id));
        }}
        onCancel={() => setIsRefundModalOpen(false)}
      >
        {'确认退款' + currentReqActivity?.name + '的' + currentRow?.name + '?'}
      </Modal>
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
                onClick={() => {
                  handleConfirmVoucher();
                }}
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
    </PageContainer>
  );
};

export default ActivityAdmin;
