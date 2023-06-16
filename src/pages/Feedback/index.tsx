// import styles from './index.less';
// import React, { useRef, useState } from 'react';
// import { ProFormUploadButton } from '@ant-design/pro-components';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ActionType, ProColumns } from '@ant-design/pro-table';
// import { ProTable } from '@ant-design/pro-table';
// import type { ActivityItem } from '@/pages/data';
// import { Button, Menu, Dropdown, Radio, Tag, Drawer, Select, message, Popconfirm } from 'antd';
// import { DownOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
// import type { MatchResultItem } from '@/pages/ActivityAdmin/data';
// import { numberFilter, numberSorter, stringSorter } from '@/utils/utils';
// import { useRequest } from '@@/plugin-request/request';
// import { Modal, Upload } from 'antd';
// import {
//   editTwc,
//   getActivityList,
//   getActivityMatchInfo,
//   modifyFailReason,
//   modifySurveyState,
//   outPool,
//   refundOne,
// } from '@/services/activity';
// import { getProductFeedbackInfo } from '@/services/feedback'
// import { Space } from 'antd';
// import { PageLoading } from '@ant-design/pro-components';
// import { getExportedExample, getExportedTable } from '@/services/activity';
// import type { FilterValue, SorterResult } from 'antd/es/table/interface';
// import { ProFormInstance } from '@ant-design/pro-components';

// const allInfoType = '全部',
//   validInfoType = '有效',
//   invalidInfoType = '无效',
//   toDoInfoType = '待处理';

// const sortActivityList = (activityList: ActivityItem[]) => {
//   return activityList.sort((o1, o2) => o2.id - o1.id);
// };

// const productFeedback: React.FC = () => {
//   const actionRef = useRef<ActionType>();
//   const [reqType, setReqType] = useState<string>(allInfoType);
//   const [reqActivity, setReqActivity] = useState<ActivityItem | undefined>(undefined);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleExportData = async () => {
//     console.log(currentReqActivity?.id);
//     const res = await getExportedTable(currentReqActivity?.id);
//     const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = `${currentReqActivity?.name}匹配信息.xls`;
//     link.click();
//   };
//   // 加载活动列表
//   // eslint-disable-next-line prefer-const
//   let { loading, data: activityList } = useRequest(getActivityList, {
//     formatResult: (res) => res?.data.activityList,
//   });

//   if (loading) {
//     return <PageLoading />;
//   }

//   // 对活动顺序排序
//   if (activityList && activityList.length) {
//     activityList = sortActivityList(activityList);
//   }
//   // 渲染活动菜单
//   const activityMenu = activityList
//     ? activityList.map((item) => ({ label: item.name, key: item.id }))
//     : [];
//   // 获取当前活动期数
//   const currentReqActivity = reqActivity ?? activityList?.at(0);

//   // 获取表格信息
//   const fetchProductTableInfo = async (params: any & API.PageParams) => {
//     const res = await getProductFeedbackInfo({
//       ...params,
//       type: reqType,
//       activityId: currentReqActivity?.id,
//       pageIndex: params.current,
//       pageSize: params.pageSize,
//     });

//     if (res && res.success) {
//       const formattedData = res.data.records.map((record: any) => {
//         return {
//           id: record.user.id,
//           name: record.user.name,
//           opinion: record.feedback.opinion,
//           gender: record.user.gender,
//           contact: record.feedback.contact,
//           create_time: record.feedback.create_time,
//           phoneNumber: record.user.phoneNumber,
//           state: record.feedback.state,
//         };
//       });

//       return {
//         data: formattedData,
//         success: true,
//         total: res.data.total,
//       };
//     } else {
//       return {
//         data: [],
//         success: false,
//       };
//     }
//   };

//   const allProductColumns: ProColumns<any>[] = [
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: '姓名',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: '反馈意见',
//       dataIndex: 'opinion',
//       key: 'opinion',
//     },
//     {
//       title: '性别',
//       dataIndex: 'gender',
//       key: 'gender',
//       valueEnum: {
//         0: {
//           text: '未填写',
//         },
//         1: {
//           text: '男',
//         },
//         2: {
//           text: '女',
//         },
//       }, filters: true,
//       onFilter: (value, record) => {
//         return numberFilter(record.gender, value as string);
//       },
//       filteredValue: filteredInfo.gender || null,
//     },
//     {
//       title: '联系方式',
//       dataIndex: 'contact',
//       key: 'contact',
//     },
//     {
//       title: '创建时间',
//       dataIndex: 'create_time',
//       key: 'create_time',
//     },
//     {
//       title: '手机号码',
//       dataIndex: 'phoneNumber',
//       key: 'phoneNumber',
//     },
//     {
//       title: '审核状态',
//       dataIndex: 'state',
//       key: 'state',
//       valueEnum: {
//         0: {
//           text: '未审核',
//         },
//         1: {
//           text: '已审核',
//         },
//       },
//     },
//     {
//       title: '操作',
//       dataIndex: 'function',
//       key: 'function',
//     },
//   ];

//   return (
//     <PageContainer>
//       <ProTable
//         headerTitle="产品意见"
//         actionRef={actionRef}
//         rowKey="key"
//         search={{
//           labelWidth: 'auto',
//         }}
//         toolbar={{
//           filter: (
//             <Radio.Group
//               buttonStyle="solid"
//               value={reqType}
//               onChange={(e) => {
//                 setReqType(e.target.value);
//                 setFilteredInfo({});
//                 setSortedInfo({});
//                 actionRef?.current?.reloadAndRest?.();
//               }}
//             >
//               <Radio.Button value={allInfoType}>全部</Radio.Button>
//               <Radio.Button value={validInfoType}>有效</Radio.Button>
//               <Radio.Button value={invalidInfoType}>无效</Radio.Button>
//               <Radio.Button value={toDoInfoType}>待处理</Radio.Button>
//             </Radio.Group>
//           ),
//           actions: [
//             <Button
//               icon={<DownloadOutlined />}
//               key="export"
//               type="primary"
//               onClick={() => handleExportData()}
//             >
//               导出数据
//             </Button>,
//           ],
//         }}
//         onChange={(_, filters, sorter) => {
//           setFilteredInfo(filters);
//           setSortedInfo(sorter as SorterResult<any>);
//         }}
//         request={fetchProductTableInfo}
//         columns={allProductColumns}
//       />
//     </PageContainer>
//   );
// };

// export default productFeedback;
