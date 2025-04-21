import { updateRule } from '@/services/api';
import {
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message, Modal } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;
export type UpdateFormProps = {
  trigger?: JSX.Element;
  onOk?: () => void;
  values: Partial<API.RuleListItem>;
};
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { run } = useRequest(updateRule, {
    manual: true,
    onSuccess: () => {
      messageApi.success('Configuration is successful');
      onOk?.();
    },
    onError: () => {
      messageApi.error('Configuration failed, please try again!');
    },
  });
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onFinish = useCallback(
    async (values?: any) => {
      await run({
        data: values,
      });
      onCancel();
    },
    [onCancel, run],
  );
  return (
    <>
      {contextHolder}
      {trigger
        ? cloneElement(trigger, {
          onClick: onOpen,
        })
        : null}
      <StepsForm
        stepsProps={{
          size: 'small',
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              width={640}
              bodyStyle={{
                padding: '32px 40px 48px',
              }}
              destroyOnClose
              title={'Rule configuration'}
              open={open}
              footer={submitter}
              onCancel={onCancel}
            >
              {dom}
            </Modal>
          );
        }}
        onFinish={onFinish}
      >
        <StepsForm.StepForm initialValues={values} title={'Basic Information'}>
          <ProFormText
            name="name"
            label={'Rule Name'}
            width="md"
            rules={[
              {
                required: true,
                message: 'Please enter the rule name!',
              },
            ]}
          />
          <ProFormTextArea
            name="desc"
            width="md"
            label={'Rule Description'}
            placeholder={'Please enter at least five characters'}
            rules={[
              {
                required: true,
                message: 'Please enter a rule description of at least five characters!',
                min: 5,
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          initialValues={{
            target: '0',
            template: '0',
          }}
          title={'Configure Properties'}
        >
          <ProFormSelect
            name="target"
            width="md"
            label={'Monitoring Object'}
            valueEnum={{
              0: '表一',
              1: '表二',
            }}
          />
          <ProFormSelect
            name="template"
            width="md"
            label={'Rule Template'}
            valueEnum={{
              0: '规则模板一',
              1: '规则模板二',
            }}
          />
          <ProFormRadio.Group
            name="type"
            label={'Rule Type'}
            options={[
              {
                value: '0',
                label: '强',
              },
              {
                value: '1',
                label: '弱',
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          initialValues={{
            type: '1',
            frequency: 'month',
          }}
          title={'Set Scheduling Period'}
        >
          <ProFormDateTimePicker
            name="time"
            width="md"
            label={'Starting Time'}
            rules={[
              {
                required: true,
                message: 'Please choose a start time!',
              },
            ]}
          />
          <ProFormSelect
            name="frequency"
            label={'Monitoring Object'}
            width="md"
            valueEnum={{
              month: '月',
              week: '周',
            }}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};
export default UpdateForm;
