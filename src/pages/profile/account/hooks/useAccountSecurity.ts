import { message } from 'antd';
import { useState } from 'react';

export const useAccountSecurity = () => {
  // 账户安全相关状态
  const [successor, setSuccessor] = useState('');
  const [designatedSuccessor, setDesignatedSuccessor] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [backupEmail, setBackupEmail] = useState('Allow all verified emails');
  const [keepPrivate, setKeepPrivate] = useState(true);
  const [blockPushes, setBlockPushes] = useState(false);

  // 密码修改方法
  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      message.warning('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('New passwords do not match');
      return;
    }

    // 模拟请求
    message.success('Password changed successfully');
    setIsModalVisible(false);
    resetPasswordFields();
  };

  const resetPasswordFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // 继承人设置方法
  const handleAddSuccessor = () => {
    if (!successor) {
      message.warning('Please enter a valid name or email');
      return;
    }
    setDesignatedSuccessor(successor);
    message.success('Successor added');
    setSuccessor('');
  };

  // 删除账户方法
  const handleDeleteAccount = () => {
    message.error('Account deleted');
    // Perform deletion logic here
  };

  // 添加备用邮箱方法
  const handleAddEmail = () => {
    if (!backupEmail) {
      message.warning('Please enter an email address');
      return;
    }
    message.success(`Email ${backupEmail} added successfully`);
  };

  return {
    successor,
    setSuccessor,
    designatedSuccessor,
    isModalVisible,
    setIsModalVisible,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleChangePassword,
    handleAddSuccessor,
    handleDeleteAccount,
    handleAddEmail
  };
};
