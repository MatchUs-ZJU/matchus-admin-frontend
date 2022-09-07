import React, {useRef, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import { ProTable} from "@ant-design/pro-table";
import type {ActivityItem,} from "@/pages/data";
import {Button, Menu, Dropdown, Radio, Tag, Drawer, Select, message, Popconfirm} from "antd";
import {DownOutlined} from "@ant-design/icons";
import type {MatchResultItem} from "@/pages/ActivityAdmin/data";
import {useRequest} from "@@/plugin-request/request";
import {editTwc, getActivityList, getActivityMatchInfo, modifyFailReason, outPool} from "@/services/activity";
import {PageLoading} from "@ant-design/pro-components";
import {CHOOSE, FAIL_MESSAGE_DURATION, NOT_CHOOSE, SUCCESS_MESSAGE_DURATION} from "@/utils/constant";
import type {FilterValue, SorterResult} from "antd/es/table/interface";
import MatchDetail from "@/pages/ActivityAdmin/MatchDetail";
import DailyQuestions from "@/pages/ActivityAdmin/DailyQuestions";

const MatchSuccessType = 0, MatchFailType = 1, MatchOutType = 2, MatchNoResultType = 3
const IN_POOL = 0, OUT_POOL = 1

const sortActivityList = (activityList: ActivityItem[]) => {
  return activityList.sort((o1, o2) => o2.id - o1.id)
}

const ActivityAdmin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [reqType, setReqType] = useState<number>(MatchSuccessType)
  const [reqActivity, setReqActivity] = useState<ActivityItem | undefined>(undefined)
  const [modifyReasonDrawerVisible, setModifyReasonDrawerVisible] = useState<boolean>(false)
  const [matchDetailDrawerVisible, setMatchDetailDrawerVisible] = useState<boolean>(false)
  const [dailyQuestionDrawerVisible, setDailyQuestionDrawerVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<MatchResultItem | undefined>(undefined)
  const [failReason, setFailReason] = useState<string>('')
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<any>>({});

  // 加载活动列表
  let {loading, data: activityList} = useRequest(getActivityList, {
    formatResult: res => res?.data.activityList
  })

  if (loading) {
    return <PageLoading/>
  }

  // 对活动顺序排序
  if (activityList && activityList.length) {
    activityList = sortActivityList(activityList)
  }
  // 渲染活动菜单
  const activityMenu = activityList ? activityList.map((item) => ({label: item.name, key: item.id})) : []
  // 获取当前活动期数
  const currentReqActivity = reqActivity ?? activityList?.at(0)

  const handleConfirmModifyReason = async () => {
    setModifyReasonDrawerVisible(false)
    const res = await modifyFailReason(currentReqActivity?.id as number, currentRow?.studentNumber as string, failReason)
    if (!res.success) {
      message.error('编辑匹配失败原因失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('编辑匹配失败原因成功', SUCCESS_MESSAGE_DURATION);
    }

    setCurrentRow(undefined)
    setFailReason('')
    actionRef?.current?.reloadAndRest?.()
  }

  const handleOutPool = async (out: number, record: MatchResultItem) => {
    const res = await outPool(currentReqActivity?.id as number, record.studentNumber as string, out)
    if (!res.success) {
      message.error('出/入库失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('出/入库成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.()
  }

  const handleEditTwc = async (choice: number, record: MatchResultItem) => {
    const res = await editTwc(currentReqActivity?.id as number, record.studentNumber as string, choice)
    if (!res.success) {
      message.error('修改双选操作失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('修改双选操作成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.()
  }

  // 获取表格信息
  const fetchTableInfo = async (
    params: any & API.PageParams
  ) => {
    const res = await getActivityMatchInfo({
      ...params,
      type: reqType,
      activityId: currentReqActivity?.id,
      pageIndex: params.current,
      pageSize: params.pageSize,
    });

    if (res.success) {
      return {
        data: res.data.records,
        success: true,
        total: res.data.total,
      };
    } else {
      return {
        data: [],
        success: false
      }
    }
  }

  // 匹配成功表格信息
  const successfulColumns: ProColumns<MatchResultItem> [] = [
    {
      key: 'successfulName',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'successfulStudentNumber',
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => o1.studentNumber.localeCompare(o2.studentNumber),
      sortOrder: sortedInfo.columnKey === 'successfulStudentNumber' ? sortedInfo.order : null,
    },
    {
      title: '性别',
      key: 'successfulGender',
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
      onFilter: (value, record) => record.gender.toString() === value,
      filteredValue: filteredInfo.successfulGender || null,
    },
    {
      title: '匹配对象',
      dataIndex: 'matchName',
      hideInForm: true,
      hideInSearch: true
    },
    {
      key: 'successfulAnswerDay',
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
      onFilter: (value, record) => record.answerDay?.toString() === value,
      filteredValue: filteredInfo.successfulAnswerDay || null,
    },
    {
      key: 'successfulTwc',
      title: '双选操作',
      dataIndex: 'twc',
      valueEnum: {
        0: {
          text: '未选择',
          status: 'Error'
        },
        1: {
          text: '选他/她',
          status: 'Success'
        },
        2: {
          text: '不选他/她',
          status: 'Warning'
        },
      },
      filters: true,
      onFilter: (value, record) => record.twc?.toString() === value,
      filteredValue: filteredInfo.successfulTwc || null,
    },
    {
      key: 'successfulTwcResult',
      title: '双选结果',
      dataIndex: 'twcResult',
      valueEnum: {
        0: {
          text: <Tag color='error'>失败</Tag>
        },
        1: {
          text: <Tag color='success'>成功</Tag>
        },
      },
      filters: true,
      onFilter: (value, record) => record.twcResult?.toString() === value,
      filteredValue: filteredInfo.successfulTwcResult || null,
    },
    {
      key: 'successfulRefund',
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error'
        },
        1: {
          text: '已退款',
          status: 'Success'
        },
      },
      filters: true,
      onFilter: (value, record) => record.refund.toString() === value,
      filteredValue: filteredInfo.successfulRefund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="matchDetail"
          onClick={() => {
            setCurrentRow(record)
            setMatchDetailDrawerVisible(true)
          }}
        >
          匹配信息
        </a>,
        <a
          key="dailyQuestion"
          onClick={() => {
            setCurrentRow(record)
            setDailyQuestionDrawerVisible(true)
          }}
        >
          每日一问
        </a>,
        <Popconfirm
          title="确认将双选操作改为?"
          onConfirm={async () => {
            await handleEditTwc(CHOOSE, record)
          }}
          onCancel={async () => {
            await handleEditTwc(NOT_CHOOSE, record)
          }}
          okText="选他/她"
          cancelText="不选他/她"
        >
          <a key="editTwc">
            修改双选操作
          </a>
        </Popconfirm>,
        <a
          key="refund"
          onClick={() => {
            console.log('refund')
          }}
        >
          <span style={{color: '#808080'}}>退款</span>
        </a>,
      ]
    },
  ]
  // 匹配失败表格信息
  const failColumns: ProColumns<MatchResultItem> [] = [
    {
      key: 'failName',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'failStudentNumber',
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => o1.studentNumber.localeCompare(o2.studentNumber),
      sortOrder: sortedInfo.columnKey === 'failStudentNumber' ? sortedInfo.order : null,
    },
    {
      key: 'failGender',
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
      onFilter: (value, record) => record.gender.toString() === value,
      filteredValue: filteredInfo.failGender || null,
    },
    {
      key: 'failProportion',
      title: '匹配人数比例',
      dataIndex: 'proportion',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, item) => {
        return `${item.proportion ? Math.round(item.proportion) : 'NaN'}%`
      },
      sorter: (o1, o2) => {
        if (!o1.proportion) return -1;
        else if (!o2.proportion) return 1;
        else return o1.proportion - o2.proportion
      },
      sortOrder: sortedInfo.columnKey === 'failProportion' ? sortedInfo.order : null,
    },
    {
      title: '失败原因',
      dataIndex: 'reason',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      key: 'failRefund',
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error'
        },
        1: {
          text: '已退款',
          status: 'Success'
        },
      },
      filters: true,
      onFilter: (value, record) => record.refund.toString() === value,
      filteredValue: filteredInfo.failRefund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="modifyReason"
          onClick={() => {
            setModifyReasonDrawerVisible(true)
            setCurrentRow(record)
          }}
        >
          修改
        </a>,
        <a
          key="refund"
          onClick={() => {
            console.log('refund')
          }}
        >
          <span style={{color: '#808080'}}>退款</span>
        </a>,
      ]
    },
  ]
  // 出库用户表格信息
  const outColumns: ProColumns<MatchResultItem> [] = [
    {
      key: 'outName',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'outStudentNumber',
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => o1.studentNumber.localeCompare(o2.studentNumber),
      sortOrder: sortedInfo.columnKey === 'outStudentNumber' ? sortedInfo.order : null,
    },
    {
      key: 'outGender',
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
      onFilter: (value, record) => record.gender.toString() === value,
      filteredValue: filteredInfo.outGender || null,
    },
    {
      key: 'outRefund',
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error'
        },
        1: {
          text: '已退款',
          status: 'Success'
        },
      },
      filters: true,
      onFilter: (value, record) => record.refund.toString() === value,
      filteredValue: filteredInfo.outRefund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a
          key="refund"
          onClick={() => {
            console.log('refund')
          }}
        >
          <span style={{color: '#808080'}}>退款</span>
        </a>,
      ]
    },
  ]
  // 匹配结果未出表格信息
  const noResultColumns: ProColumns<MatchResultItem> [] = [
    {
      key: 'noResultName',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'noResultStudentNumber',
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => o1.studentNumber.localeCompare(o2.studentNumber),
      sortOrder: sortedInfo.columnKey === 'noResultStudentNumber' ? sortedInfo.order : null,
    },
    {
      key: 'noResultGender',
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
      onFilter: (value, record) => record.gender.toString() === value,
      filteredValue: filteredInfo.noResultGender || null,
    },
    {
      key: 'noResultSurveyComplete',
      title: '问卷填写',
      dataIndex: 'surveyComplete',
      valueEnum: {
        0: {
          text: '未填写',
          status: 'Error'
        },
        1: {
          text: '填写中',
          status: 'Warning'
        },
        2: {
          text: '已完成',
          status: 'Success'
        }
      },
      filters: true,
      onFilter: (value, record) => record.surveyComplete.toString() === value,
      filteredValue: filteredInfo.noResultSurveyComplete || null,
    },
    {
      key: 'noResultOut',
      title: '参与/是否出库',
      dataIndex: 'out',
      valueEnum: {
        1: {
          text: '出库',
          status: 'Error'
        },
        0: {
          text: '参与',
          status: 'Success'
        },
      },
      filters: true,
      onFilter: (value, record) => record.out.toString() === value,
      filteredValue: filteredInfo.noResultOut || null,
    },
    {
      key: 'noResultRefund',
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {
        0: {
          text: '未退款',
          status: 'Error'
        },
        1: {
          text: '已退款',
          status: 'Success'
        },
      },
      filters: true,
      onFilter: (value, record) => record.refund.toString() === value,
      filteredValue: filteredInfo.noResultRefund || null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="out"
          onClick={async () => {
            setCurrentRow(record)
            await handleOutPool(record.out === IN_POOL ? OUT_POOL : IN_POOL, record)
          }}
        >
          {`${record.out === IN_POOL ? '出' : '入'}库`}
        </a>,
        <a
          key="refund"
          onClick={() => {
            console.log('refund')
          }}
        >
          <span style={{color: '#808080'}}>退款</span>
        </a>,
      ]
    },
  ]

  return (
    <PageContainer>
      <ProTable
        <MatchResultItem>
        headerTitle='活动信息表格'
        actionRef={actionRef}
        rowKey='key'
        search={{
          labelWidth: 'auto',
        }}
        toolbar={{
          filter: (
            <Radio.Group buttonStyle="solid"
                         value={reqType}
                         onChange={(e) => {
                           setReqType(e.target.value)
                           setFilteredInfo({})
                           setSortedInfo({})
                           actionRef?.current?.reloadAndRest?.()
                         }}
            >
              <Radio.Button value={MatchSuccessType}>匹配成功</Radio.Button>
              <Radio.Button value={MatchFailType}>匹配失败</Radio.Button>
              <Radio.Button value={MatchOutType}>出库用户</Radio.Button>
              <Radio.Button value={MatchNoResultType}>匹配结果未出</Radio.Button>
            </Radio.Group>
          ),
          actions: [
            <Dropdown
              key="overlay"
              overlay={
                <Menu
                  onClick={(e) => {
                    const selectedActivity = activityList?.find((item) => item.id === parseInt(e.key))
                    if(selectedActivity?.id !== currentReqActivity?.id) {
                      setReqActivity(activityList?.find((item) => item.id === parseInt(e.key)))
                      actionRef?.current?.reloadAndRest?.()
                    }
                  }}
                  items={activityMenu}
                 />
              }
            >
              <Button>
                {currentReqActivity ? currentReqActivity.name : '选择活动'}
                <DownOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Button>
            </Dropdown>,
          ],
        }}
        onChange={(_, filters, sorter) => {
          setFilteredInfo(filters);
          setSortedInfo(sorter as SorterResult<any>);
        }}
        request={fetchTableInfo}
        columns={reqType === MatchSuccessType ? successfulColumns : reqType === MatchFailType ? failColumns : reqType === MatchOutType ? outColumns : noResultColumns}
      />
      <MatchDetail
        visible={matchDetailDrawerVisible}
        onClose={() => {
          setMatchDetailDrawerVisible(false)
          setCurrentRow(undefined)
        }}
        activity={currentReqActivity}
        values={currentRow}
      />
      <DailyQuestions
        visible={dailyQuestionDrawerVisible}
        onClose={() => {
          setDailyQuestionDrawerVisible(false)
          setCurrentRow(undefined)
        }}
        activity={currentReqActivity}
        values={currentRow}
      />
      <Drawer
        title='修改失败理由'
        width={400}
        onClose={() => {
          setModifyReasonDrawerVisible(false)
          setCurrentRow(undefined)
          setFailReason('')
        }}
        visible={modifyReasonDrawerVisible}
        bodyStyle={{paddingBottom: 80}}
      >
        {
          modifyReasonDrawerVisible &&
          <Select placeholder='请选择失败理由' style={{width: "300px"}} onChange={(v) => setFailReason(v)}>
            <Select.Option value="条件匹配人数过少">条件匹配人数过少</Select.Option>
            <Select.Option value="注册信息审核不通过">注册信息审核不通过</Select.Option>
            <Select.Option value="其它">其它</Select.Option>
          </Select>
        }
        <Button size='large' type="primary" style={{marginTop: '24px'}} onClick={handleConfirmModifyReason}>
          确认
        </Button>
      </Drawer>
    </PageContainer>
  )
}

export default ActivityAdmin
