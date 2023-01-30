import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ProTable } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  Alert,
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Radio,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { getUserRegisterInfo, checkRegisterInfo, editRegisterInfo } from '@/services/users';
import type { UserRegisterInfoItem } from '@/pages/RegisterAdmin/data';
import {
  FAIL_MESSAGE_DURATION,
  IDENTIFY_NOT_PASS,
  IDENTIFY_PASS,
  IDENTIFY_STATUS,
  MAX_REASON_LENGTH,
  SUCCESS_MESSAGE_DURATION,
} from '@/utils/constant';
import DescriptionItem from '@/components/DescriptionItem';
import { getGenderText, getUserTypeText } from '@/utils/format';
import { useRequest } from '@@/plugin-request/request';
import { getFacultyList } from '@/services/faculty';
import { PageLoading } from '@ant-design/pro-components';
import { numberFilter, stringSorter } from '@/utils/utils';

const denyReasonChoices = (
  <>
    <Select.Option value={'关键信息有遮挡'}>关键信息有遮挡</Select.Option>
    <Select.Option value={'学号填写错误'}>学号填写错误</Select.Option>
    <Select.Option value={'姓名不符合要求'}>姓名不符合要求</Select.Option>
    <Select.Option value={'用户类型不符'}>用户类型不符</Select.Option>
    <Select.Option value={'学院不符'}>学院不符</Select.Option>
    <Select.Option value={'其它问题'}>其它问题</Select.Option>
  </>
);

const RegisterAdmin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);
  const [identifyDrawerVisible, setIdentifyDrawerVisible] = useState<boolean>(false);
  const [identifyDenyReasonModalVisible, setIdentifyDenyReasonModalVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<UserRegisterInfoItem>();
  const [denyReasons, setDenyReasons] = useState<string[]>([]);

  // FETCH 学院信息
  const { loading, data: faculties } = useRequest(getFacultyList, {
    formatResult: (res) => res?.data,
  });

  if (loading) {
    return <PageLoading />;
  }

  const handleIdentifyPass = async () => {
    setIdentifyDrawerVisible(false);
    const res = await checkRegisterInfo(currentRow?.id as string, IDENTIFY_PASS);
    if (!res || !res.success) {
      message.error('审核用户失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('审核用户成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.();
  };

  const handleIdentifyDeny = async () => {
    if (denyReasons.length === 0) {
      message.error('请选择审核失败原因', FAIL_MESSAGE_DURATION);
      return;
    } else if (denyReasons.toString().length > MAX_REASON_LENGTH) {
      message.error('原因总长度不能超过20个字符', FAIL_MESSAGE_DURATION);
      return;
    }

    setIdentifyDrawerVisible(false);
    setIdentifyDenyReasonModalVisible(false);
    const res = await checkRegisterInfo(
      currentRow?.id as string,
      IDENTIFY_NOT_PASS,
      denyReasons.toString(),
    );

    if (!res || !res.success) {
      message.error('审核用户失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('审核用户成功', SUCCESS_MESSAGE_DURATION);
    }

    actionRef?.current?.reloadAndRest?.();
  };

  const handleEditRegisterForm = async (values: any) => {
    setEditDrawerVisible(false);
    const res = await editRegisterInfo(currentRow?.id as string, values);
    if (!res || !res.success) {
      message.error('编辑用户注册信息失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('编辑用户注册信息成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };

  const columns: ProColumns<UserRegisterInfoItem>[] = [
    {
      title: '用户姓名',
      dataIndex: 'realname',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      sorter: (o1, o2) => {
        return stringSorter(o1.studentNumber, o2.studentNumber);
      },
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
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      valueEnum: {
        1: {
          text: '在校生',
          status: 'Success',
        },
        2: {
          text: '校友',
          status: 'Error',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.userType, value as string);
      },
    },
    {
      title: '个人信息',
      dataIndex: 'isComplete',
      valueEnum: {
        0: {
          text: '未完善',
          status: 'Error',
        },
        1: {
          text: '已完善',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.isComplete, value as string);
      },
    },
    {
      title: '注册审核状态',
      dataIndex: 'identified',
      valueEnum: {
        0: {
          text: '未认证',
          status: 'Error',
        },
        1: {
          text: '认证中',
          status: 'Processing',
        },
        2: {
          text: '认证失败',
          status: 'Warning',
        },
        3: {
          text: '认证成功',
          status: 'Success',
        },
      },
      filters: true,
      onFilter: (value, record) => {
        return numberFilter(record.identified, value as string);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <a
          key="identify"
          onClick={() => {
            setIdentifyDrawerVisible(true);
            setCurrentRow(record);
          }}
        >
          认证
        </a>,
        <a
          key="edit"
          onClick={() => {
            setEditDrawerVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<UserRegisterInfoItem>
        headerTitle="注册信息表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" disabled>
            <ExportOutlined /> 导出
          </Button>,
        ]}
        request={async (params: any & API.PageParams) => {
          const res = await getUserRegisterInfo({
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
              success: false,
            };
          }
        }}
        columns={columns}
      />
      <Drawer
        title="认证信息"
        width={400}
        onClose={() => {
          setIdentifyDrawerVisible(false);
          setCurrentRow(undefined);
        }}
        visible={identifyDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Alert
          style={{ marginBottom: '24px' }}
          message={
            (currentRow?.identified as number) === IDENTIFY_STATUS.SUCCESS
              ? '认证通过'
              : (currentRow?.identified as number) === IDENTIFY_STATUS.FAIL
              ? '审核不通过'
              : (currentRow?.identified as number) === IDENTIFY_STATUS.IDENTIFYING
              ? '待审核'
              : '用户未认证'
          }
          type={
            (currentRow?.identified as number) === IDENTIFY_STATUS.SUCCESS
              ? 'success'
              : (currentRow?.identified as number) === IDENTIFY_STATUS.FAIL
              ? 'error'
              : (currentRow?.identified as number) === IDENTIFY_STATUS.IDENTIFYING
              ? 'warning'
              : 'info'
          }
          showIcon
        />
        <Row>
          <Col span={24}>
            <DescriptionItem title="姓名" content={currentRow?.realname} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="学号" content={currentRow?.studentNumber} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="性别" content={getGenderText(currentRow?.gender)} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="身份" content={getUserTypeText(currentRow?.userType)} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="学院"
              content={faculties?.[(currentRow?.faculty as number) - 1]?.name}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Image src={currentRow?.material} />
          </Col>
        </Row>
        <Divider />
        <Space>
          <Button
            type="primary"
            size="large"
            style={{ width: '96px' }}
            onClick={handleIdentifyPass}
          >
            通过
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ width: '96px' }}
            danger
            onClick={() => setIdentifyDenyReasonModalVisible(true)}
          >
            不通过
          </Button>
        </Space>
      </Drawer>
      <Modal
        title="请选择失败理由"
        visible={identifyDenyReasonModalVisible}
        onCancel={() => {
          setDenyReasons([]);
          setIdentifyDenyReasonModalVisible(false);
        }}
        onOk={handleIdentifyDeny}
        afterClose={() => {
          setDenyReasons([]);
        }}
      >
        {identifyDenyReasonModalVisible && (
          <Select
            mode="tags"
            allowClear
            style={{ width: '300px' }}
            placeholder="请选择失败理由"
            onChange={(v) => setDenyReasons(v)}
          >
            {denyReasonChoices}
          </Select>
        )}
      </Modal>
      <Drawer
        title="注册信息详情"
        width={400}
        onClose={() => {
          setEditDrawerVisible(false);
          setCurrentRow(undefined);
        }}
        visible={editDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {editDrawerVisible && (
          <Form initialValues={currentRow!} onFinish={handleEditRegisterForm}>
            <Form.Item
              label="姓名"
              name="realname"
              rules={[{ required: true, message: '姓名不可为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="学号"
              name="studentNumber"
              rules={[{ required: true, message: '学号不可为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="性别"
              name="gender"
              rules={[{ required: true, message: '性别不可为空' }]}
            >
              <Radio.Group>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="用户类型"
              name="userType"
              rules={[{ required: true, message: '用户类型不可为空' }]}
            >
              <Radio.Group>
                <Radio value={1}>在校生</Radio>
                <Radio value={2}>校友</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="学院"
              name="faculty"
              rules={[{ required: true, message: '学院不可为空' }]}
            >
              <Select placeholder="选择学院" allowClear>
                {faculties?.map((faculty) => (
                  <Option value={faculty.id}>{faculty.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="手机号"
              name="phoneNumber"
              rules={[{ required: true, message: '手机号不可为空' }]}
            >
              <Input type="tel" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12 }}>
              <Button size="large" type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RegisterAdmin;
