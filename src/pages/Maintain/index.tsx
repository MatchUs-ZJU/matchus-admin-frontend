import { getMaintainTime, updateMaintainTime } from '@/services/maintain';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

const Maintain: React.FC = () => {
  const formRef = useRef<ProFormInstance<API.MaintainTime>>();
  const [initialValues, setInitialValues] = useState<API.MaintainTime>();

  const setInitial = (value: API.MaintainTime) => {
    setInitialValues(value);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formRef && formRef.current && formRef.current.resetFields();
  };

  const submitMaintainForm = async (maintain: API.MaintainTime) => {
    const value = await updateMaintainTime(
      maintain.startTime,
      maintain.endTime,
      maintain.activate,
      maintain.description,
    );
    if (!!value && !!value.data) {
      message.success('修改维护时间成功');
      setInitial(value.data);
    }
  };

  useEffect(() => {
    const fn = async () => {
      const value = await getMaintainTime();
      if (!!value && !!value.data) {
        setInitial(value.data);
      }
    };
    fn();
  }, []);

  return (
    <PageContainer>
      <ProCard title="修改状态" bordered headerBordered>
        <ProForm
          formRef={formRef}
          onFinish={async () => {
            const fields = await formRef.current?.validateFieldsReturnFormatValue?.();
            if (!fields) {
              return false;
            }
            submitMaintainForm(fields);
            return true;
          }}
          initialValues={initialValues}
        >
          <ProFormRadio.Group
            name="activate"
            label="是否开启维护"
            options={[
              {
                label: '开启',
                value: true,
              },
              {
                label: '关闭',
                value: false,
              },
            ]}
          />
          <ProFormDateTimeRangePicker
            name="datetimeRange"
            label="维护时长"
            required
            rules={[
              {
                required: true,
                message: '请填入维护时长',
              },
            ]}
            transform={(value) => {
              console.log(value);
              return {
                startTime: moment(value[0]).utc(),
                endTime: moment(value[1]).utc(),
              };
            }}
            initialValue={[moment(initialValues?.startTime), moment(initialValues?.endTime)]}
          />
          <ProFormTextArea
            name="description"
            label="维护原因"
            placeholder="维护原因"
            fieldProps={{
              maxLength: 150,
              showCount: true,
            }}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default Maintain;
