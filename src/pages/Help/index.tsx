import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { Table, Button } from 'antd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const Help: React.FC = () => {
  const columnsArticle: ColumnsType = [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '回答',
      dataIndex: 'pic',
      key: 'pic',
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
        <div className={styles.title}>
          <div>常见问题</div>
          <Button type="primary">新增</Button>
        </div>
        <DndProvider backend={HTML5Backend}>
          <Table columns={columnsArticle} />
        </DndProvider>
      </div>
    </PageContainer>
  );
};

export default Help;
