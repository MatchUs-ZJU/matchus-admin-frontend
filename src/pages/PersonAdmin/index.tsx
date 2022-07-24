import React, {useRef} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {ActionType, ProTable} from "@ant-design/pro-table";
import type {ProColumns} from "@ant-design/pro-table";
import {PaginationParamType, PersonInfoItem, UserGeneralInfoItem} from "@/pages/data";
import {Button} from "antd";
import {EditOutlined, ExportOutlined} from "@ant-design/icons";
import {getUserGeneralInfo} from "@/services/users";


const PersonAdmin: React.FC = () => {

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
      title: '颜值',
      // dataIndex: 'userType',
      valueEnum: {}
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      valueEnum: {}
    },
    {
      title: '微信',
      dataIndex: 'wxNumber',
      valueEnum: {}
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="judge"
          onClick={() => {
            console.log('judge')
          }}
        >
          打分
        </a>,
        <a
          key="more"
          onClick={() => {
            console.log('more')
          }}
        >
          详情
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

export default PersonAdmin
