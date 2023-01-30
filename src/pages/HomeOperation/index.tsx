import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, Input, message, Drawer } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { getHistoryData, editHistoryData } from '@/services/history';
import { FAIL_MESSAGE_DURATION, SUCCESS_MESSAGE_DURATION } from '@/utils/constant';
import { getCarouselData } from '@/services/carousel';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ProFormUploadDragger } from '@ant-design/pro-form';
import { ProForm, ProFormText } from '@ant-design/pro-form';
import { editCarouselInfo, DeleteCarousel } from '@/services/carousel';
import { getTweetsData } from '@/services/tweet';
import { ProFormDatePicker } from '@ant-design/pro-form';
import { publishTweet } from '@/services/tweet';
import { DeleteTweet } from '@/services/tweet';

type CarouselItem = {
  id?: number;
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
  const getHistory = async () => {
    const res = await getHistoryData();
    if (res.success) {
      return res.data;
    } else {
      console.log('error');
      return undefined;
    }
  };

  const [initialHistory, setInitialHistory] = useState<API.HistoryData | undefined>({});
  const [carouselEditVisible, setCarouselEditVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CarouselItem>({});
  const [tweetEditVisible, setTweetEditVisible] = useState<boolean>(false);

  useEffect(() => {
    getHistory().then((formvalue) => {
      setInitialHistory(formvalue);
    });
  }, []);

  const handleEditCarouselForm = async (values: any) => {
    setCarouselEditVisible(false);
    const res = await editCarouselInfo(values);
    if (!res || !res.success) {
      message.error('上传轮播图失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('上传轮播图成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
  };

  const handleDeleteCarousel = async (id: number) => {
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
    actionRef?.current?.reloadAndRest?.();
  };

  const handleEditTweetForm = async (values: any) => {
    setTweetEditVisible(false);
    const res = await publishTweet(values);
    if (!res || !res.success) {
      message.error('推文发布失败', FAIL_MESSAGE_DURATION);
    } else {
      message.success('推文发布成功', SUCCESS_MESSAGE_DURATION);
    }
    actionRef?.current?.reloadAndRest?.();
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
      title: '顺序',
      dataIndex: 'id',
      key: 'id',
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
        <a onClick={() => setCarouselEditVisible(true)} key="edit">
          编辑{' '}
        </a>,
        <a key="delete" onClick={() => handleDeleteCarousel(record.id as number)}>
          删除
        </a>,
      ],
    },
  ];
  const columnsArticle: ProColumns<TweetsItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
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
              <Form.Item
                label="顺序"
                name="id"
                rules={[
                  {
                    required: true,
                    message: '请输入序号',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="轮播图"
                name="image"
                rules={[
                  {
                    required: true,
                    message: '请上传轮播图',
                  },
                ]}
              >
                <ProFormUploadDragger label="" name="dragger" action="upload.do" />
              </Form.Item>
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
                label="题目"
                name="title"
                rules={[
                  {
                    required: true,
                    message: '请输入题目',
                  },
                ]}
              >
                <Input />
              </ProFormText>
              <ProFormText
                label="链接"
                name="url"
                rules={[
                  {
                    required: true,
                    message: '请输入链接',
                  },
                ]}
              >
                <Input />
              </ProFormText>
              <ProFormText
                label="标签#"
                name="tag"
                rules={[
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ]}
              >
                <Input />
              </ProFormText>
              <ProFormText
                label="日期"
                name="date"
                rules={[
                  {
                    required: true,
                    message: '请输入报名开始时间',
                  },
                ]}
              >
                <ProFormDatePicker name="startDate" label="报名开始时间" />
              </ProFormText>
            </ProForm>
          )}
        </Drawer>
        <Form
          initialValues={initialHistory}
          title="历史数据"
          name="历史数据"
          size="middle"
          layout="inline"
          wrapperCol={{ offset: 1, span: 16 }}
          onFinish={handleEditHistoryData}
        >
          <Form.Item
            label="已举办期数"
            name="totalTerm"
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
            name="matchs"
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
            name="unavailable"
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
            name="participants"
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
            <Button type="primary" htmlType="submit" shape="round">
              提交
            </Button>
          </Form.Item>
        </Form>
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
                setCarouselEditVisible(true);
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
                setTweetEditVisible(true);
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
