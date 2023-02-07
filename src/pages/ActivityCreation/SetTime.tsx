import React, { useState } from 'react';
import { Form, DatePicker } from 'antd';

import {
  ProFormTimePicker,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';

const SetTime = ({ add }) => {
  return (
    <div>
      <ProForm layout="horizontal" onFinish={(values) => add(values)}>
        <ProForm.Group>
          <ProFormText width="xs" name="term" label="期数" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDateRangePicker name="dateRange" label="活动时间" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="signUpStartDate" label="报名开始时间" />
          <ProFormTimePicker name="signUpStartTime" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="signUpEndDate" label="报名结束时间" />
          <ProFormTimePicker name="signUpEndTime" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="matchResultShowDate" label="匹配结果公布时间" />
          <ProFormTimePicker name="matchResultShowTime" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="twoWayChooseStartDate" label="双选开始时间" />
          <ProFormTimePicker name="twoWayChooseStartTime" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="twoWayChooseEndDate" label="双选结束时间" />
          <ProFormTimePicker name="twoWayChooseEndTime" label="" />
        </ProForm.Group>
      </ProForm>
    </div>
  );
};

export default SetTime;
