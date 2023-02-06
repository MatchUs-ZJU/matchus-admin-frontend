import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import styles from './index.less';
import { getHelpData } from '@/services/help';
import { Drawer } from 'antd';
import ProForm from '@ant-design/pro-form';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { message } from 'antd';
import { deleteQuestion } from '@/services/help';
import { FAIL_MESSAGE_DURATION, SUCCESS_MESSAGE_DURATION } from '@/utils/constant';
import { useRef } from 'react';
import { editQuestionData, createQuestionData } from '@/services/help';
import { numberFilter, numberSorter, stringSorter } from '@/utils/utils';

type HelpItem = {
  id?: number;
  question?: string;
  answer?: string;
  sequence?: number;
};

const Help: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<HelpItem>({});
  const [questionEditVisible, setQuestionEditVisible] = useState<boolean>(false);
  const [questionCreateVisible, setQuestionCreateVisible] = useState<boolean>(false);

  const handleEditQuestionForm = async (values: any) => {
    if (currentRow.id) values.id = currentRow.id;
    console.log(values);
    const res = await editQuestionData(values);
    if (!res || !res.success) {
      message.error('编辑常见问题失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('编辑常见问题成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };

  const handleCreateQuestionForm = async (values: any) => {
    if (currentRow.id) values.id = currentRow.id;
    console.log(values);
    const res = await createQuestionData(values);
    if (!res || !res.success) {
      message.error('新建常见问题失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('新建常见问题成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };

  const handleDeleteQuestion = async (id: number) => {
    const res = await deleteQuestion(id);
    if (!res || !res.success) {
      message.error('删除轮播图失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('删除轮播图成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };

  const columnsArticle: ProColumns<HelpItem>[] = [
    {
      title: '序号',
      dataIndex: 'sequence',
      key: 'sequence',
      sorter: (o1, o2) => {
        return numberSorter(o1.sequence, o2.sequence);
      },
    },
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: '回答',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            setQuestionEditVisible(true);
          }}
          key="upload"
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleDeleteQuestion(record.id as number);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Drawer
        title="常见问题"
        width={400}
        onClose={() => {
          setQuestionEditVisible(false);
          setCurrentRow({});
        }}
        visible={questionEditVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {questionEditVisible && (
          <ProForm initialValues={currentRow} onFinish={handleEditQuestionForm}>
            <ProFormText
              label="序号"
              name="sequence"
              rules={[
                {
                  required: true,
                  message: '请输入序号',
                },
              ]}
            />
            <ProFormText
              label="问题"
              name="question"
              rules={[
                {
                  required: true,
                  message: '请输入问题',
                },
              ]}
            />
            <ProFormTextArea
              label="回答"
              name="answer"
              rules={[
                {
                  required: true,
                  message: '请输入回答',
                },
              ]}
            />
          </ProForm>
        )}
      </Drawer>
      <Drawer
        title="常见问题"
        width={400}
        onClose={() => {
          setQuestionCreateVisible(false);
          setCurrentRow({});
        }}
        visible={questionCreateVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {questionCreateVisible && (
          <ProForm initialValues={currentRow} onFinish={handleCreateQuestionForm}>
            <ProFormText
              label="问题"
              name="question"
              rules={[
                {
                  required: true,
                  message: '请输入问题',
                },
              ]}
            />
            <ProFormTextArea
              label="回答"
              name="answer"
              rules={[
                {
                  required: true,
                  message: '请输入回答',
                },
              ]}
            />
          </ProForm>
        )}
      </Drawer>
      <div className={styles.container}>
        <div className={styles.title}>
          <div>常见问题</div>
        </div>

        <ProTable<HelpItem>
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCurrentRow({});
                setQuestionCreateVisible(true);
              }}
            >
              新建
            </Button>,
          ]}
          columns={columnsArticle}
          cardBordered
          actionRef={actionRef}
          rowKey="key"
          request={async (params: any & API.PageParams) => {
            const res = await getHelpData();
            console.log(res);
            if (res.success) {
              return {
                data: res.data,
                success: true,
              };
            } else {
              return {
                data: [],
                success: false,
              };
            }
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Help;
