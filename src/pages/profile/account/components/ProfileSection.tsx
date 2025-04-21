import { LinkOutlined, UploadOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Flex, Input, Select, Typography, Upload } from 'antd';
import { pronounOptions } from '../hooks/useProfileSettings';

const { Title, Text } = Typography;

export const ProfileSection = ({ settings }: { settings: any }) => {
  return (
    <>
      {/* Avatar */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Avatar</Title>
        <Flex align="center" gap={16}>
          <Avatar
            size={64}
            src={settings.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
          />
          <Upload
            showUploadList={false}
            beforeUpload={settings.beforeUpload}
            onChange={settings.handleAvatarChange}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess && onSuccess('ok');
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
            value={settings.editedName}
            onChange={(e) => settings.setEditedName(e.target.value)}
            placeholder="Enter your name"
            style={{ maxWidth: 300 }}
          />
          <Button
            type="primary"
            disabled={settings.editedName === settings.name}
            onClick={settings.updateName}
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
            value={settings.editedEmail}
            onChange={(e) => settings.setEditedEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ maxWidth: 300 }}
          />
          <Button
            type="primary"
            disabled={settings.editedEmail === settings.email || !settings.isValidEmail(settings.editedEmail)}
            onClick={settings.updateEmail}
          >
            Save
          </Button>
        </Flex>
        {!settings.isValidEmail(settings.editedEmail) && (
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
            value={settings.editedBio}
            onChange={(e) => settings.setEditedBio(e.target.value)}
            placeholder="Tell us a little bit about yourself"
            rows={4}
            style={{ width: '100%' }}
          />
          <Flex justify="flex-end">
            <Button
              type="primary"
              disabled={settings.editedBio === settings.bio}
              onClick={settings.updateBio}
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
          <Select value={settings.pronoun} onChange={settings.setPronoun} options={pronounOptions} />
          {settings.pronoun === 'custom' && (
            <Input
              value={settings.customPronoun}
              onChange={(e) => settings.setCustomPronoun(e.target.value)}
              placeholder="Enter custom pronouns"
            />
          )}
        </Flex>
      </ProCard>

      {/* Social */}
      <ProCard bordered style={{ marginBottom: 24 }}>
        <Title level={5}>Social accounts</Title>
        <Flex vertical gap={8}>
          {settings.socialLinks.map((link: string, index: number) => (
            <Input
              key={index}
              value={link}
              onChange={(e) => settings.handleSocialLinkChange(index, e.target.value)}
              prefix={<LinkOutlined />}
              placeholder={`Link to social profile ${index + 1}`}
              style={{ backgroundColor: '#f6f8fa' }}
            />
          ))}
        </Flex>
      </ProCard>
    </>
  );
};
