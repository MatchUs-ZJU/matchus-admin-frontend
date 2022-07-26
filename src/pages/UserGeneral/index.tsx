import React, {useRef, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {ActionType, ProTable} from "@ant-design/pro-table";
import type {ProColumns} from "@ant-design/pro-table";
import {Button, message, Modal, Tag} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {deleteUser, editBlackList, getUserGeneralInfo} from "@/services/users";
import {UserGeneralInfoItem} from "@/pages/UserGeneral/data";
import {
  ADD_BLACK_LIST,
  FAIL_MESSAGE_DURATION,
  REMOVE_BLACK_LIST,
  SUCCESS_MESSAGE_DURATION
} from "@/utils/constant";


const UserGeneral: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [confirmEditBlackListModalVisible, setConfirmEditBlackListModalVisible] = useState<boolean>(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<UserGeneralInfoItem>();

  const handleConfirmDelete = async () => {
    setConfirmDeleteModalVisible(false)
    const res = await deleteUser(currentRow?.id as number)
    if (!res.success) {
      message.error('删除用户失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('删除用户成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.()
  }

  const handleConfirmEditBlackList = async () => {
    setConfirmEditBlackListModalVisible(false)
    const res = await editBlackList(currentRow?.id as number, currentRow?.isBlack ? REMOVE_BLACK_LIST : ADD_BLACK_LIST)
    if (!res.success) {
      message.error('编辑黑名单失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('编辑黑名单成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.()
  }

  const columns: ProColumns<UserGeneralInfoItem>[] = [
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => parseInt(o1.studentNumber) - parseInt(o2.studentNumber)
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
      onFilter: (value, record) => record.gender.toString() === value
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
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
    },
    {
      title: '注册审核状态',
      dataIndex: 'identified',
      valueEnum: {
        0: {
          text: '未认证',
          status: 'Error'
        },
        1: {
          text: '认证中',
          status: 'Processing'
        },
        2: {
          text: '认证失败',
          status: 'Warning'
        },
        3: {
          text: '认证成功',
          status: 'Success'
        },
      },
      filters: true,
      onFilter: (value, record) => record.identified.toString() === value
    },
    {
      title: '注册材料',
      width: 150,
      dataIndex: 'material',
      hideInSearch: true,
      valueType: 'image'
    },
    {
      title: '个人信息',
      dataIndex: 'isComplete',
      valueEnum: {
        0: {
          text: '未完善',
          status: 'Error'
        },
        1: {
          text: '已完善',
          status: 'Success'
        },
      },
      filters: true,
      onFilter: (value, record) => record.isComplete.toString() === value
    },
    {
      title: '活动信息',
      dataIndex: 'activityList',
      width: 300,
      hideInSearch: true,
      filters: Array.from({length: 20}).map((_, index) => {
        return {
          text: `第${index + 1}期`,
          value: index + 1
        };
      }),
      filterMultiple: false,
      onFilter: (value, record) => {
        return record.activityList.includes(value as number)
      },
      render: (_, {activityList}) => (
        <>
          {activityList.sort((o1, o2) => o1 - o2).map(activity => {
            return (
              <Tag color='purple' key={activity}>
                第{activity}期
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '黑名单状态',
      dataIndex: 'isBlack',
      valueEnum: {
        0: {
          text: '否',
          status: 'Success'
        },
        1: {
          text: '是',
          status: 'Error'
        },
      },
      filters: true,
      onFilter: (value, record) => record.isBlack.toString() === value
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <a
          key="delete"
          onClick={() => {
            setConfirmDeleteModalVisible(true)
            setCurrentRow(record)
          }}
        >
          删除
        </a>,
        <a
          key="editBlackList"
          onClick={() => {
            setConfirmEditBlackListModalVisible(true)
            setCurrentRow(record)
          }}
        >
          {record.isBlack ? '移除' : '加入'}黑名单
        </a>,
      ]
    },
  ]


  return (
    <PageContainer>
      <ProTable
        <UserGeneralInfoItem>
        headerTitle='用户信息表格'
        cardBordered
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
        request={async (
          params: any & API.PageParams
        ) => {
          const res = await getUserGeneralInfo({
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
      />
      <Modal title="删除用户" visible={confirmDeleteModalVisible}
             onOk={handleConfirmDelete}
             onCancel={() => setConfirmDeleteModalVisible(false)}
             okText='确认'
             cancelText='取消'
      >
        确认删除该用户：姓名-{currentRow?.realName} 学号-{currentRow?.studentNumber} ?
      </Modal>
      <Modal title={`将用户${currentRow?.isBlack ? '移除' : '加入'}黑名单`} visible={confirmEditBlackListModalVisible}
             onOk={handleConfirmEditBlackList}
             onCancel={() => setConfirmEditBlackListModalVisible(false)}
             okText='确认'
             cancelText='取消'
      >
        确认将该用户{currentRow?.isBlack ? '移除' : '加入'}黑名单：姓名-{currentRow?.realName} 学号-{currentRow?.studentNumber} ?
      </Modal>
    </PageContainer>
  )
}

export default UserGeneral
