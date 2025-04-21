import { addRule } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import { FC } from 'react';
interface CreateFormProps {
  reload?: ActionType['reload'];
}
const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;
  const [messageApi, contextHolder] = message.useMessage();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const { run, loading } = useRequest(addRule, {
    manual: true,
    onSuccess: () => {
      messageApi.success('Added successfully');
      reload?.();
    },
    onError: () => {
      messageApi.error('Adding failed, please try again!');
    },
  });
  return (
    <>
      {contextHolder}
      <ModalForm
        title={'New Rule'}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            New
          </Button>
        }
        width="400px"
        modalProps={{
          okButtonProps: {
            loading,
          },
        }}
        onFinish={async (value) => {
          await run({
            data: value as API.RuleListItem,
          });
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: 'Rule name is required',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
    </>
  );
};
export default CreateForm;
