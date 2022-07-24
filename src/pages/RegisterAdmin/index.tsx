import React, {useRef} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {ActionType, ProTable} from "@ant-design/pro-table";
import type {ProColumns} from "@ant-design/pro-table";
import {PaginationParamType, UserGeneralInfoItem, UserRegisterInfoItem} from "@/pages/data";
import {Button} from "antd";
import {DownloadOutlined, EditOutlined, ExportOutlined} from "@ant-design/icons";
import {getUserGeneralInfo} from "@/services/users";


const RegisterAdmin: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserRegisterInfoItem>[] = [
    {
      title: '用户姓名',
      dataIndex: 'realName',
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
      title: '手机号',
      dataIndex: 'phoneNumber',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      valueEnum: {}
    },
    {
      title: '注册审核状态',
      dataIndex: 'identified',
      valueEnum: {}
    },
    {
      title: '注册材料',
      dataIndex: 'material',
      valueEnum: {}
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="identify"
          onClick={() => {
            console.log('identify')
          }}
        >
          认证
        </a>,
        <a
          key="edit"
          onClick={() => {
            console.log('edit')
          }}
        >
          编辑
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
        <UserRegisterInfoItem, PaginationParamType>
        headerTitle='注册信息表格'
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

export default RegisterAdmin
