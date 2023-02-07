import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, Input, message, Drawer } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { getHistoryData, editHistoryData } from '@/services/history';
import { FAIL_MESSAGE_DURATION, SUCCESS_MESSAGE_DURATION } from '@/utils/constant';
import { getCarouselData } from '@/services/carousel';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ProForm, ProFormText } from '@ant-design/pro-form';
import { editCarouselInfo, DeleteCarousel } from '@/services/carousel';
import { getTweetsData } from '@/services/tweet';
import { ProFormDatePicker } from '@ant-design/pro-form';
import { publishTweet, createTweet } from '@/services/tweet';
import { DeleteTweet } from '@/services/tweet';
import { numberFilter, numberSorter, stringSorter } from '@/utils/utils';
import { createCarouselInfo } from '@/services/carousel';

type CarouselItem = {
  id?: number;
  sequence?: number;
  image?: string;
};
type TweetsItem = {
  id?: number;
  title?: string;
  description?: string;
  tag?: string;
  date?: string;
  url?: string;
  image?: string;
};

const HomeOperation: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const tweetRef = useRef<ActionType>();

  const [initialHistory, setInitialHistory] = useState<API.HistoryData | undefined>({});
  const [carouselEditVisible, setCarouselEditVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CarouselItem>({});
  const [tweetEditVisible, setTweetEditVisible] = useState<boolean>(false);
  const [carouselCreateVisible, setCarouselCreateVisible] = useState<boolean>(false);
  const [tweetCreateVisible, setTweetCreateVisible] = useState<boolean>(false);

  const getHistory = async () => {
    const res = await getHistoryData();
    if (res.success) {
      console.log(res.data);
      return res.data;
    } else {
      console.log('error');
      return null;
    }
  };

  const handleEditCarouselForm = async (values: any) => {
    setCarouselEditVisible(false);
    if (currentRow.id) values.id = currentRow.id;
    console.log(values);
    const res = await editCarouselInfo(values);
    if (!res || !res.success) {
      message.error('上传轮播图失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('上传轮播图成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };
  const handleCreateCarouselForm = async (values: any) => {
    setCarouselCreateVisible(false);
    if (currentRow.id) values.id = currentRow.id;
    console.log(values);
    const res = await createCarouselInfo(values);
    if (!res || !res.success) {
      message.error('上传轮播图失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('上传轮播图成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };

  const handleDeleteCarousel = async (id: number) => {
    console.log(`我的id是${id}`);
    const res = await DeleteCarousel(id);
    if (!res || !res.success) {
      message.error('删除轮播图失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('删除轮播图成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };

  const handleDeleteTweet = async (id: number) => {
    const res = await DeleteTweet(id);
    if (!res || !res.success) {
      message.error('删除推文失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('删除推文成功', SUCCESS_MESSAGE_DURATION);
    }
    tweetRef?.current?.reloadAndRest?.();
  };

  const handleEditTweetForm = async (values: any) => {
    setTweetEditVisible(false);
    if (currentRow.id) values.id = currentRow.id;
    console.log(values);
    const res = await publishTweet(values);
    if (!res || !res.success) {
      message.error('推文发布失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('推文发布成功', SUCCESS_MESSAGE_DURATION);
    }
    tweetRef?.current?.reloadAndRest?.();
  };

  const handleCreateTweetForm = async (values: any) => {
    setTweetEditVisible(false);
    if (currentRow.id) values.id = currentRow.id;
    console.log(values);
    const res = await createTweet(values);
    if (!res || !res.success) {
      message.error('推文发布失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('推文发布成功', SUCCESS_MESSAGE_DURATION);
    }
    tweetRef?.current?.reloadAndRest?.();
  };

  console.log(initialHistory);
  const handleEditHistoryData = async (values: any) => {
    const res = await editHistoryData(values);
    if (!res || !res.success) {
      message.error('编辑历史数据失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('编辑历史数据成功', SUCCESS_MESSAGE_DURATION);
    }
    getHistory();
  };

  const columnsCarousel: ProColumns<API.CarouselData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '序号',
      dataIndex: 'sequence',
      key: 'sequence',
      sorter: (o1, o2) => {
        return numberSorter(o1.sequence, o2.sequence);
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      valueType: 'image',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      key: 'operation',
      valueType: 'option',
      render: (_, record) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            setCarouselEditVisible(true);
          }}
          key="edit"
        >
          编辑{' '}
        </a>,
        <a key="delete" onClick={() => handleDeleteCarousel(record.id)}>
          删除
        </a>,
      ],
    },
  ];
  const columnsArticle: ProColumns<TweetsItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '序号',
      dataIndex: 'sequence',
      key: 'sequence',
      sorter: (o1, o2) => {
        return numberSorter(o1.sequence, o2.sequence);
      },
    },
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      valueType: 'image',
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      valueType: 'date',
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: '微信号文章',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
            setTweetEditVisible(true);
          }}
          key="upload"
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleDeleteTweet(record.id as number);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.title}>历史数据</div>

        <Drawer
          title="轮播图详情"
          width={400}
          onClose={() => {
            setCarouselEditVisible(false);
            setCurrentRow({});
          }}
          visible={carouselEditVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {carouselEditVisible && (
            <ProForm initialValues={currentRow} onFinish={handleEditCarouselForm}>
              <ProFormText
                label="顺序"
                name="sequence"
                placeholder="请输入该图片的序号"
                rules={[
                  {
                    required: true,
                    message: '请输入序号',
                  },
                ]}
              />
              <ProFormText
                label="轮播图"
                name="image"
                placeholder="请填入轮播图的链接"
                rules={[
                  {
                    required: true,
                    message: '请填入轮播图的链接',
                  },
                ]}
              />
            </ProForm>
          )}
        </Drawer>

        <Drawer
          title="新增轮播图"
          width={400}
          onClose={() => {
            setCarouselCreateVisible(false);
            setCurrentRow({});
          }}
          visible={carouselCreateVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {/* 新建 */}
          {carouselCreateVisible && (
            <ProForm initialValues={currentRow} onFinish={handleCreateCarouselForm}>
              <ProFormText
                label="轮播图"
                name="image"
                placeholder="请填入轮播图的链接"
                rules={[
                  {
                    required: true,
                    message: '请填入轮播图的链接',
                  },
                ]}
              />
            </ProForm>
          )}
        </Drawer>
        <Drawer
          title="推文详情"
          width={400}
          onClose={() => {
            setTweetEditVisible(false);
            setCurrentRow({});
          }}
          visible={tweetEditVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {tweetEditVisible && (
            <ProForm initialValues={currentRow} onFinish={handleEditTweetForm}>
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
                label="题目"
                name="title"
                rules={[
                  {
                    required: true,
                    message: '请输入题目',
                  },
                ]}
              />
              <ProFormText
                label="链接"
                name="url"
                rules={[
                  {
                    required: true,
                    message: '请输入链接',
                  },
                ]}
              />
              <ProFormText
                label="标签#"
                name="tag"
                rules={[
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ]}
              />
              <ProFormText
                label="图片"
                name="image"
                rules={[
                  {
                    required: true,
                    message: '请填入图片链接',
                  },
                ]}
              />
              <ProFormDatePicker
                rules={[
                  {
                    required: true,
                    message: '请输入时间',
                  },
                ]}
                name="date"
                label="时间"
              />
            </ProForm>
          )}
        </Drawer>
        <Drawer
          title="发布推文"
          width={400}
          onClose={() => {
            setTweetCreateVisible(false);
            setCurrentRow({});
          }}
          visible={tweetCreateVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {tweetCreateVisible && (
            <ProForm initialValues={currentRow} onFinish={handleCreateTweetForm}>
              <ProFormText
                label="题目"
                name="title"
                rules={[
                  {
                    required: true,
                    message: '请输入题目',
                  },
                ]}
              />
              <ProFormText
                label="链接"
                name="url"
                rules={[
                  {
                    required: true,
                    message: '请输入链接',
                  },
                ]}
              />
              <ProFormText
                label="标签#"
                name="tag"
                rules={[
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ]}
              />
              <ProFormText
                label="图片"
                name="image"
                rules={[
                  {
                    required: true,
                    message: '请填入图片链接',
                  },
                ]}
              />
              <ProFormDatePicker
                rules={[
                  {
                    required: true,
                    message: '请输入时间',
                  },
                ]}
                name="date"
                label="时间"
              />
            </ProForm>
          )}
        </Drawer>
        <ProForm
          title="历史数据"
          name="历史数据"
          size="middle"
          style={{ maxWidth: 300 }}
          wrapperCol={{ span: 32 }}
          layout="vertical"
          onFinish={handleEditHistoryData}
          request={() => getHistory()}
        >
          <ProFormText
            label="已举办期数"
            name="totalTerm"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          />

          <ProFormText
            label="配对成功人数"
            name="matchs"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          />

          <ProFormText
            label="成功脱单人数"
            name="unavailable"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          />

          <ProFormText
            label="活动参与人数"
            name="participants"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          />
        </ProForm>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>
          <div>轮播图</div>
        </div>
        <ProTable<API.CarouselData>
          headerTitle="轮播图表格"
          cardBordered
          columns={columnsCarousel}
          rowKey="key"
          actionRef={actionRef}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCurrentRow({});
                setCarouselCreateVisible(true);
              }}
            >
              新建
            </Button>,
          ]}
          request={async (params: any & API.PageParams) => {
            const res = await getCarouselData();
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

      <div className={styles.container}>
        <div className={styles.title}>
          <div>推文列表</div>
        </div>

        <ProTable
          columns={columnsArticle}
          headerTitle="推文表格"
          cardBordered
          rowKey="key"
          actionRef={tweetRef}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCurrentRow({});
                setTweetCreateVisible(true);
              }}
            >
              新建
            </Button>,
          ]}
          request={async (params: any & API.PageParams) => {
            const res = await getTweetsData();
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

export default HomeOperation;
