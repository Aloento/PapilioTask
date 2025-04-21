import { LockOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Space, Typography } from 'antd';

const { Title, Paragraph, Link } = Typography;

export const SecuritySection = ({ settings }: { settings: any }) => {
  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Password</Title>
        <Paragraph>
          Strengthen your account by ensuring your password is strong.{' '}
          <Link href="https://github.com/settings/security#password" target="_blank">
            Learn more about creating a strong password
          </Link>
        </Paragraph>
        <Button
          type="primary"
          icon={<LockOutlined />}
          onClick={() => settings.setIsModalVisible(true)}
        >
          Change password
        </Button>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4} style={{ color: 'red' }}>
          Delete account
        </Title>
        <Paragraph>
          Once you delete your account, there is no going back. Please be certain.
        </Paragraph>
        <Button danger onClick={settings.handleDeleteAccount}>
          Delete your account
        </Button>
      </Card>

      <Modal
        title="Change Password"
        open={settings.isModalVisible}
        onCancel={() => settings.setIsModalVisible(false)}
        onOk={settings.handleChangePassword}
        okText="Update Password"
        cancelText="Cancel"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.Password
            placeholder="Current Password"
            value={settings.oldPassword}
            onChange={(e) => settings.setOldPassword(e.target.value)}
          />
          <Input.Password
            placeholder="New Password"
            value={settings.newPassword}
            onChange={(e) => settings.setNewPassword(e.target.value)}
          />
          <Input.Password
            placeholder="Confirm New Password"
            value={settings.confirmPassword}
            onChange={(e) => settings.setConfirmPassword(e.target.value)}
          />
        </Space>
      </Modal>
    </>
  );
};
