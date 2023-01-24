import React, { useState } from 'react';
import { Form, DatePicker } from 'antd';

import {
  ProFormTimePicker,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';

const SetTime = () => {
  return (
    <div>
      <ProForm layout="horizontal">
        <ProForm.Group>
          <ProFormText width="xs" name="name" label="期数" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDateRangePicker name="dateRange" label="活动时间" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="startDate" label="报名开始时间" />
          <ProFormTimePicker name="startTime" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="endDate" label="报名结束时间" />
          <ProFormTimePicker name="endTime" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="releaseTime" label="匹配结果公布时间" />
          <ProFormTimePicker name="releaseDate" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="matchDate" label="双选开始时间" />
          <ProFormTimePicker name="matchTime" label="" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name="matchEndDate" label="双选结束时间" />
          <ProFormTimePicker name="matchEndTime" label="" />
        </ProForm.Group>
      </ProForm>
    </div>
  );
};

export default SetTime;
