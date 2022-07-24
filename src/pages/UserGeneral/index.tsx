import React, {useRef} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {ActionType, ProTable} from "@ant-design/pro-table";
import type {ProColumns} from "@ant-design/pro-table";
import {PaginationParamType, UserGeneralInfoItem} from "@/pages/data";
import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {getUserGeneralInfo} from "@/services/users";


const UserGeneral: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserGeneralInfoItem>[] = [
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '姓名',
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
      title: '个人信息',
      dataIndex: 'basicInfo',
      valueEnum: {}
    },
    {
      title: '活动信息',
      dataIndex: 'activityList',
      valueEnum: {}
    },
    {
      title: '黑名单状态',
      dataIndex: 'isBlack',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="delete"
          onClick={() => {
            console.log('delete')
          }}
        >
          删除
        </a>,
        <a
          key="addBlackList"
          onClick={() => {
            console.log('add black list')
          }}
        >
          加入黑名单
        </a>,
      ]
    },
  ]


  return (
    <PageContainer
      header={{
        title: '用户概览'
      }}
    >
      <ProTable
        <UserGeneralInfoItem, PaginationParamType>
        headerTitle='用户信息表格'
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
            <DownloadOutlined/> 下载
          </Button>,
        ]}
        request={getUserGeneralInfo}
        columns={columns}
      />
    </PageContainer>
  )
}

export default UserGeneral
