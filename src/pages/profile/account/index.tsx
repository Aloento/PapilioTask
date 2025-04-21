import { LinkOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Card, Divider, Flex, Input, message, Modal, Select, Space, Typography, Upload } from 'antd';
import React, { useRef, useState } from 'react';

const { Title, Paragraph, Link, Text } = Typography;

const pronounOptions = [
  { label: "Don't specify", value: '' },
  { label: 'they/them', value: 'they/them' },
  { label: 'she/her', value: 'she/her' },
  { label: 'he/him', value: 'he/him' },
  { label: 'Custom', value: 'custom' },
];

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SettingsPage: React.FC = () => {
  // 原有的 account 状态
  const [successor, setSuccessor] = useState('');
  const [designatedSuccessor, setDesignatedSuccessor] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [backupEmail, setBackupEmail] = useState('Allow all verified emails');
  const [keepPrivate, setKeepPrivate] = useState(true);
  const [blockPushes, setBlockPushes] = useState(false);

  // 从 publicprofile 导入的状态
  const [name, setName] = useState('Janice');
  const [editedName, setEditedName] = useState(name);
  const [email, setEmail] = useState('Janice@outlook.com');
  const [editedEmail, setEditedEmail] = useState(email);
  const [bio, setBio] = useState('');
  const [editedBio, setEditedBio] = useState(bio);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [pronoun, setPronoun] = useState('she/her');
  const [customPronoun, setCustomPronoun] = useState('');
  const [socialLinks, setSocialLinks] = useState([
    'Link to social profile 1',
    'Link to social profile 2',
    'Link to social profile 3',
    'Link to social profile 4',
  ]);

  // 防止重复上传提示
  const isAvatarUpdating = useRef(false);

  // 原有的 account 方法
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
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAddSuccessor = () => {
    if (!successor) {
      message.warning('Please enter a valid name or email');
      return;
    }
    setDesignatedSuccessor(successor);
    message.success('Successor added');
    setSuccessor('');
  };

  const handleDeleteAccount = () => {
    message.error('Account deleted');
    // Perform deletion logic here
  };

  const handleAddEmail = () => {
    if (!email) {
      message.warning('Please enter an email address');
      return;
    }
    message.success(`Email ${email} added successfully`);
    setEmail('');
  };

  // 从 publicprofile 导入的方法
  const beforeUpload = (file: File) => {
    const isValidType =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/jpg';

    if (!isValidType) {
      message.error('Only JPG, JPEG, PNG, or GIF files are allowed.');
    }

    return isValidType || Upload.LIST_IGNORE;
  };

  const handleAvatarChange = (info: any) => {
    const file = info.file.originFileObj;
    if (!file || isAvatarUpdating.current) return;

    isAvatarUpdating.current = true; // 上锁
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target?.result as string);
      message.destroy(); // 清除旧提示
      message.success('Avatar updated!');
      isAvatarUpdating.current = false; // 解锁
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    message.success('Profile saved successfully!');
    console.log({
      name,
      email,
      bio,
      pronoun: pronoun === 'custom' ? customPronoun : pronoun,
      avatar,
    });
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Account Settings</Title>

      {/* 公开资料部分 - 从 publicprofile 导入 */}
      <Title level={4} style={{ marginTop: 24 }}>Public Profile</Title>

      {/* Avatar */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Avatar</Title>
        <Flex align="center" gap={16}>
          <Avatar
            size={64}
            src={avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
          />
          <Upload
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleAvatarChange}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess && onSuccess('ok'); // 模拟立即成功
              }, 0);
            }}
          >
            <Button icon={<UploadOutlined />}>Change Avatar</Button>
          </Upload>
        </Flex>
      </ProCard>

      {/* Name */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Name</Title>
        <Flex gap={8}>
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Enter your name"
            style={{ maxWidth: 300 }}
          />
          <Button
            type="primary"
            disabled={editedName === name}
            onClick={() => {
              setName(editedName);
              message.success('Name updated!');
            }}
          >
            Save
          </Button>
        </Flex>
      </ProCard>

      {/* Email */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Public email</Title>
        <Flex gap={8}>
          <Input
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ maxWidth: 300 }}
          />
          <Button
            type="primary"
            disabled={editedEmail === email || !isValidEmail(editedEmail)}
            onClick={() => {
              if (!isValidEmail(editedEmail)) {
                message.error('Invalid email format');
                return;
              }
              setEmail(editedEmail);
              message.success('Email updated!');
            }}
          >
            Save
          </Button>
        </Flex>
        {!isValidEmail(editedEmail) && (
          <Text type="danger" style={{ marginTop: 4 }}>
            Invalid email format
          </Text>
        )}
      </ProCard>

      {/* Bio */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Bio</Title>
        <Flex vertical gap={8}>
          <Input.TextArea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            placeholder="Tell us a little bit about yourself"
            rows={4}
            style={{ width: '100%' }}
          />
          <Flex justify="flex-end">
            <Button
              type="primary"
              disabled={editedBio === bio}
              onClick={() => {
                setBio(editedBio);
                message.success('Bio updated!');
              }}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </ProCard>

      {/* Pronouns */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Pronouns</Title>
        <Flex vertical gap={8} style={{ maxWidth: 300 }}>
          <Select value={pronoun} onChange={setPronoun} options={pronounOptions} />
          {pronoun === 'custom' && (
            <Input
              value={customPronoun}
              onChange={(e) => setCustomPronoun(e.target.value)}
              placeholder="Enter custom pronouns"
            />
          )}
        </Flex>
      </ProCard>

      {/* Social */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Social accounts</Title>
        <Flex vertical gap={8}>
          {socialLinks.map((link, index) => (
            <Input
              key={index}
              value={link}
              onChange={(e) => handleSocialLinkChange(index, e.target.value)}
              prefix={<LinkOutlined />}
              placeholder={`Link to social profile ${index + 1}`}
              style={{ backgroundColor: '#f6f8fa' }}
            />
          ))}
        </Flex>
      </ProCard>

      <Divider />

      {/* 安全部分 - account 原有功能 */}
      <Title level={4}>Security</Title>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Password</Title>
        <Paragraph>
          Strengthen your account by ensuring your password is strong.{' '}
          <Link href="https://github.com/settings/security#password" target="_blank">
            Learn more about creating a strong password
          </Link>
        </Paragraph>
        <Button type="primary" icon={<LockOutlined />} onClick={() => setIsModalVisible(true)}>
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
        <Button danger onClick={handleDeleteAccount}>
          Delete your account
        </Button>
      </Card>

      {/* 保存所有更改按钮 */}
      <Flex justify="flex-end" style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleSave}>
          Save All Changes
        </Button>
      </Flex>

      <Modal
        title="Change Password"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleChangePassword}
        okText="Update Password"
        cancelText="Cancel"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.Password
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input.Password
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input.Password
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default SettingsPage;
