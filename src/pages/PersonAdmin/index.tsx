import React, {useRef, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {ActionType, ColumnsState, ProTable} from "@ant-design/pro-table";
import type {ProColumns} from "@ant-design/pro-table";
import {Radio, Button, Col, Divider, Drawer, Image, Row, Space, message} from "antd";
import {EditOutlined, ExportOutlined} from "@ant-design/icons";
import {PersonInfoItem} from "@/pages/PersonAdmin/data";
import {getPersonalInfo, rateAppearance} from "@/services/users";
import {FAIL_MESSAGE_DURATION, SUCCESS_MESSAGE_DURATION} from "@/utils/constant";
import DescriptionItem from "@/components/DescriptionItem";
import {getGenderText, getUserTypeText} from "@/utils/format";
import {useRequest} from "@@/plugin-request/request";
import {getFacultyList} from "@/services/faculty";
import {PageLoading} from "@ant-design/pro-components";

const columnAttrList = [
  {column: '生日', dataIndex: 'birth'},
  {column: '家乡', dataIndex: 'hometown'},
  {column: '身高', dataIndex: 'height'},
  {column: '体重', dataIndex: 'weight'},
  {column: '体型', dataIndex: 'physique'},
  {column: '手机号', dataIndex: 'phoneNumber'},
  {column: '微信号', dataIndex: 'wechatNumber'},
  {column: '行业', dataIndex: 'industry'},
  {column: '在校生：一年内状态', dataIndex: 'oneYearStatus'},
  {column: '在校生：未来发展地', dataIndex: 'futureBase'},
  {column: '在校生：自选未来发展地', dataIndex: 'selfFutureBase'},
  {column: '气质外表', dataIndex: 'temperament'},
  {column: '兴趣爱好', dataIndex: 'interest'},
  {column: '熬夜频率', dataIndex: 'stayUpFrequency'},
  {column: '运动频率', dataIndex: 'exerciseFrequency'},
  {column: '抽烟习惯', dataIndex: 'smokingHabit'},
  {column: '蹦迪习惯', dataIndex: 'discoHabit'},
  {column: '饮酒习惯', dataIndex: 'drinkHabit'},
  {column: '参与意愿', dataIndex: 'willingness'},
  {column: '恋爱次数', dataIndex: 'loveHistory'},
  {column: '在校生：消费水平', dataIndex: 'consumption'},
  {column: '在校生：消费分担', dataIndex: 'consumption_share'},
  {column: 'MBTI', dataIndex: 'mbti'},
  {column: '校友：学历', dataIndex: 'graduateEducation'},
  {column: '校友：工作岗位', dataIndex: 'graduateWorkLocation'},
  {column: '校友：工作收入', dataIndex: 'graduateIncome'},
  {column: '校友：工作细节', dataIndex: 'graduateWorkDetail'},
]

const getInitialColumnsState = () => {
  let result = {}
  columnAttrList.forEach((attr) => {
    result[attr.dataIndex] = {
      show: false
    }
  })
  return result
}

const calcScrollWidth = (columnsState: Record<string, ColumnsState>) => {
  let columnNumber = 0
  for (const name in columnsState) {
    if (columnsState[name].show) {
      columnNumber += 1
    }
  }
  return columnNumber * 200
}

const PersonAdmin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [columnsState, setColumnsState] = useState<Record<string, ColumnsState>>(getInitialColumnsState);
  const [ratingDrawerVisible, setRatingDrawerVisible] = useState<boolean>(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<PersonInfoItem>();
  const [currentRating, setCurrentRating] = useState<number>(0);

  // FETCH 学院信息
  const {loading, data: faculties} = useRequest(getFacultyList, {
    formatResult: res => res?.data
  })

  if (loading) {
    return <PageLoading/>
  }

  const handleConfirmRating = async () => {
    setRatingDrawerVisible(false)
    if (currentRating !== 0) {
      const res = await rateAppearance(currentRow?.id as string, currentRating)
      if (!res.success) {
        message.error('颜值打分失败', FAIL_MESSAGE_DURATION);
      } else {
        message.success('颜值打分成功', SUCCESS_MESSAGE_DURATION);
      }
    } else {
      message.warning('未选择颜值分数', FAIL_MESSAGE_DURATION);
    }

    setCurrentRow(undefined)
    setCurrentRating(0)
    actionRef?.current?.reloadAndRest?.()
  }

  const columns: ProColumns<PersonInfoItem>[] = [
    {
      title: '姓名',
      dataIndex: 'realName',
      fixed: 'left',
      width: 100
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      valueEnum: {
        0: {
          text: '未认证',
          status: 'Error',
        },
        1: {
          text: '在校生',
          status: 'Success',
        },
        2: {
          text: '3年内校友',
          status: 'Success',
        },
        3: {
          text: '3年以上校友',
          status: 'Success',
        },
      },
      fixed: 'left',
      width: 150
    },
    {
      title: '颜值',
      dataIndex: 'appearance',
      valueEnum: {
        0: {
          text: '未打分',
          status: 'Warning'
        },
        1: {
          text: '前0-10%',
        },
        2: {
          text: '前10-30%',
        },
        3: {
          text: '前30-50%',
        },
        4: {
          text: '前50-70%',
        },
        5: {
          text: '前70-100%',
        },
      },
      sorter: (o1, o2) => o2.appearance - o1.appearance,
      filters: true,
      onFilter: (value, record) => record.appearance.toString() === value,
      fixed: 'left',
      width: 150
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
      onFilter: (value, record) => record.gender.toString() === value,
      fixed: 'left',
      width: 150
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: "right",
      render: (_, record) => [
        <a
          key="rate"
          onClick={() => {
            setRatingDrawerVisible(true)
            setCurrentRow(record)
          }}
        >
          打分
        </a>,
        <a
          key="more"
          onClick={() => {
            setDetailDrawerVisible(true)
            setCurrentRow(record)
          }}
        >
          详情
        </a>,
      ],
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => o1.studentNumber.localeCompare(o2.studentNumber),
    },
    {
      title: '学院',
      dataIndex: 'faculty',
      renderText: (_, record) => {
        return faculties?.[record.faculty as number]?.name
      },
    }
  ]

  columnAttrList.forEach((columnAttr) => {
    columns.push({
      title: columnAttr.column,
      dataIndex: columnAttr.dataIndex,
      key: columnAttr.dataIndex,
    })
  })


  return (
    <PageContainer>
      <ProTable
        <PersonInfoItem>
        headerTitle='个人信息表格'
        actionRef={actionRef}
        rowKey='key'
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            disabled
          >
            <EditOutlined/> 修改
          </Button>,
          <Button
            type="primary"
            key="primary"
            disabled
          >
            <ExportOutlined/> 导出
          </Button>,
        ]}
        request={async (
          params: any & API.PageParams
        ) => {
          const res = await getPersonalInfo({
            ...params,
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
        }}
        columns={columns}
        scroll={{x: calcScrollWidth(columnsState), y: 600}}
        columnsState={{
          value: columnsState,
          onChange: setColumnsState,
        }}
      />
      <Drawer
        title='颜值打分'
        width={600}
        onClose={() => {
          setRatingDrawerVisible(false)
          setCurrentRow(undefined)
        }}
        visible={ratingDrawerVisible}
        bodyStyle={{paddingBottom: 80}}
      >
        <Row>
          <Col span={24}>
            <DescriptionItem title='姓名' content={currentRow?.realName}/>
          </Col>
        </Row>
        {
          currentRow?.photos?.map((photo) => (
            <Row style={{marginBottom: '12px'}}>
              <Col span={24}>
                <Image style={{height: '150px'}} src={photo}/>
              </Col>
            </Row>
          ))
        }
        <Divider/>
        {
          ratingDrawerVisible &&
          <Radio.Group buttonStyle="solid" onChange={(e) => setCurrentRating(e.target.value)}>
            <Radio.Button value={1}>前0-10%</Radio.Button>
            <Radio.Button value={2}>前10-30%</Radio.Button>
            <Radio.Button value={3}>前30-50%</Radio.Button>
            <Radio.Button value={4}>前50-70%</Radio.Button>
            <Radio.Button value={5}>前70-100%</Radio.Button>
          </Radio.Group>
        }
        <Space style={{marginTop: '24px'}}>
          <Button type="primary" size='large' style={{width: '96px'}}
                  onClick={() => handleConfirmRating()}>提交</Button>
          <Button type="primary" size='large' style={{width: '96px'}} danger disabled
                  onClick={() => {
                    setCurrentRating(6)
                    handleConfirmRating()
                  }}>不符合</Button>
        </Space>
      </Drawer>
      <Drawer
        title='个人信息详情'
        width={800}
        onClose={() => {
          setDetailDrawerVisible(false)
          setCurrentRow(undefined)
        }}
        visible={detailDrawerVisible}
        bodyStyle={{paddingBottom: 80}}
      >
        <Row>
          <Col span={12}>
            <DescriptionItem title='姓名' content={currentRow?.realName}/>
          </Col>
          <Col span={12}>
            <DescriptionItem title='学号' content={currentRow?.studentNumber}/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title='性别' content={getGenderText(currentRow?.gender)}/>
          </Col>
          <Col span={12}>
            <DescriptionItem title='生日' content={currentRow?.birth}/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title='用户类型' content={getUserTypeText(currentRow?.userType)}/>
          </Col>
          <Col span={12}>
            <DescriptionItem title='院系' content={faculties?.[currentRow?.faculty as number]?.name}/>
          </Col>
        </Row>
        {
          columnAttrList.map((_, index) => {
            if (index % 2 == 0) {
              return (
                <Row>
                  <Col span={12}>
                    <DescriptionItem title={columnAttrList[index].column} content={currentRow?.[columnAttrList[index].dataIndex]} />
                  </Col>
                  {
                    (index !== (columnAttrList.length-1)) &&
                    <Col span={12}>
                      <DescriptionItem title={columnAttrList[index+1].column} content={currentRow?.[columnAttrList[index+1].dataIndex]} />
                    </Col>
                  }
                </Row>
              )
            } else {
              return <></>
            }
          })
        }
      </Drawer>
    </PageContainer>
  )
}

export default PersonAdmin
