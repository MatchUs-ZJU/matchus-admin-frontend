import React, {useRef} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {ActionType, ProTable} from "@ant-design/pro-table";
import type {ProColumns} from "@ant-design/pro-table";
import {PaginationParamType, PersonInfoItem} from "@/pages/data";
import {Button} from "antd";
import {EditOutlined, ExportOutlined} from "@ant-design/icons";
import {getUserGeneralInfo} from "@/services/users";


const ActivityAdmin: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<PersonInfoItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
    },
    {
      title: '性别',
      dataIndex: 'gender',
    },
    {
      title: '匹配对象',
      dataIndex: 'matchName',
    },
    {
      title: '回答天数',
      dataIndex: 'answerDay',
      valueEnum: {}
    },
    {
      title: '双选操作',
      dataIndex: 'twc',
      valueEnum: {}
    },
    {
      title: '双选结果',
      dataIndex: 'twcResult',
      valueEnum: {}
    },
    {
      title: '退款结果',
      dataIndex: 'refund',
      valueEnum: {}
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            console.log('detail')
          }}
        >
          详情
        </a>,
        <a
          key="match"
          onClick={() => {
            console.log('match')
          }}
        >
          匹配
        </a>,
        <a
          key="modify"
          onClick={() => {
            console.log('modify')
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
          退款
        </a>,
      ]
    },
  ]


  return (
    <PageContainer
      header={{
        title: '注册信息'
      }}
    >
      <ProTable
        <PersonInfoItem, PaginationParamType>
        headerTitle='个人信息表格'
        actionRef={actionRef}
        rowKey='key'
        search={{
          labelWidth: 120,
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
        request={getUserGeneralInfo}
        columns={columns}
      />
    </PageContainer>
  )
}

export default ActivityAdmin
