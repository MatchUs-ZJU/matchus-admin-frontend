import React, {useRef} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {ActionType, ProTable} from "@ant-design/pro-table";
import type {ProColumns} from "@ant-design/pro-table";
import {PaginationParamType} from "@/pages/data";
import {Button, Menu, Dropdown, Radio} from "antd";
import {DownOutlined, EditOutlined, ExportOutlined} from "@ant-design/icons";
import {MatchSuccessItem} from "@/pages/ActivityAdmin/data";


const ActivityAdmin: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<MatchSuccessItem>[] = [
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
    <PageContainer>
      <ProTable
        <MatchSuccessItem, PaginationParamType>
        headerTitle='活动信息表格'
        actionRef={actionRef}
        rowKey='key'
        search={{
          labelWidth: 'auto',
        }}
        toolbar={{
          filter: (
            <Radio.Group buttonStyle="solid"
                         // onChange={(e) => setCurrentRating(e.target.value)}
            >
              <Radio.Button value={1}>匹配成功</Radio.Button>
              <Radio.Button value={2}>匹配失败</Radio.Button>
              <Radio.Button value={3}>出库用户</Radio.Button>
            </Radio.Group>
          ),
          actions: [
            <Dropdown
              key="overlay"
              overlay={
                <Menu onClick={() => alert('menu click')}>
                  <Menu.Item key="1">菜单</Menu.Item>
                  <Menu.Item key="2">列表</Menu.Item>
                  <Menu.Item key="3">表单</Menu.Item>
                </Menu>
              }
            >
              <Button>
                选择活动
                <DownOutlined
                  style={{
                    marginLeft: 8,
                  }}
                />
              </Button>
            </Dropdown>,
          ],
        }}
        //request={getUserGeneralInfo}
        columns={columns}
      />
    </PageContainer>
  )
}

export default ActivityAdmin
