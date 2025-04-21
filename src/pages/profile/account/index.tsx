import { Button, Divider, Flex, message, Typography } from 'antd';
import React from 'react';
import { ProfileSection } from './components/ProfileSection';
import { SecuritySection } from './components/SecuritySection';
import { useAccountSecurity } from './hooks/useAccountSecurity';
import { useProfileSettings } from './hooks/useProfileSettings';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  // 使用自定义钩子管理个人资料相关状态和方法
  const profileSettings = useProfileSettings();

  // 使用自定义钩子管理账户安全相关状态和方法
  const securitySettings = useAccountSecurity();

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Account Settings</Title>

      {/* 公开资料部分 */}
      <Title level={4} style={{ marginTop: 24 }}>Public Profile</Title>
      <ProfileSection settings={profileSettings} />

      <Divider />

      {/* 安全部分 */}
      <Title level={4}>Security</Title>
      <SecuritySection settings={securitySettings} />

      {/* 保存所有更改按钮 */}
      <Flex justify="flex-end" style={{ marginTop: 24 }}>
        <Button
          type="primary"
          onClick={() => {
            profileSettings.handleSave();
            message.success('All changes saved successfully');
          }}
        >
          Save All Changes
        </Button>
      </Flex>
    </div>
  );
};

export default SettingsPage;
