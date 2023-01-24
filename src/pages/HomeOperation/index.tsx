import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, Input } from 'antd';
import type { HistoryData } from './data';
import { Table } from 'antd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import React from 'react';
import styles from './index.less';
import type { ColumnsType } from 'antd/es/table';

const HomeOperation: React.FC = () => {
  const columnsCarousel: ColumnsType = [
    {
      title: '顺序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '图片',
      dataIndex: 'pic',
      key: 'pic',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => [<a key="upload">上传</a>, <a key="delete">删除</a>],
    },
  ];
  const columnsArticle: ColumnsType<DataType> = [
    {
      title: '顺序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '图片',
      dataIndex: 'pic',
      key: 'pic',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 200,
      render: (_, record) => [<a key="upload">编辑</a>, <a key="delete">删除</a>],
    },
  ];
  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.title}>历史数据</div>
        <Form
          title="历史数据"
          name="历史数据"
          size="middle"
          layout="inline"
          wrapperCol={{ offset: 1, span: 16 }}
          disabled
        >
          <Form.Item
            label="已举办期数"
            name="已举办期数"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="配对成功人数"
            name="配对成功人数"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="成功脱单人数"
            name="成功脱单人数"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="活动参与人数"
            name="活动参与人数"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item style={{ marginTop: '30px' }}>
            <Button shape="round">修改</Button>
          </Form.Item>
          <Form.Item style={{ marginTop: '30px' }}>
            <Button type="primary" htmlType="submit" shape="round">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>
          <div>轮播图</div>
          <Button type="primary">新增</Button>
        </div>
        <DndProvider backend={HTML5Backend}>
          <Table columns={columnsCarousel} />
        </DndProvider>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>
          <div>推文列表</div>
          <Button type="primary">新增</Button>
        </div>
        <DndProvider backend={HTML5Backend}>
          <Table columns={columnsArticle} />
        </DndProvider>
      </div>
    </PageContainer>
  );
};

export default HomeOperation;
