import { message, Upload } from 'antd';
import { useRef, useState } from 'react';

export const pronounOptions = [
  { label: "Don't specify", value: '' },
  { label: 'they/them', value: 'they/them' },
  { label: 'she/her', value: 'she/her' },
  { label: 'he/him', value: 'he/him' },
  { label: 'Custom', value: 'custom' },
];

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const useProfileSettings = () => {
  // 个人资料相关状态
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

  // 头像处理方法
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

    isAvatarUpdating.current = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target?.result as string);
      message.destroy();
      message.success('Avatar updated!');
      isAvatarUpdating.current = false;
    };
    reader.readAsDataURL(file);
  };

  // 保存个人资料
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

  // 更新姓名
  const updateName = () => {
    setName(editedName);
    message.success('Name updated!');
  };

  // 更新邮件
  const updateEmail = () => {
    if (!isValidEmail(editedEmail)) {
      message.error('Invalid email format');
      return;
    }
    setEmail(editedEmail);
    message.success('Email updated!');
  };

  // 更新简介
  const updateBio = () => {
    setBio(editedBio);
    message.success('Bio updated!');
  };

  // 更新社交链接
  const handleSocialLinkChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };

  return {
    name,
    editedName,
    setEditedName,
    email,
    editedEmail,
    setEditedEmail,
    bio,
    editedBio,
    setEditedBio,
    avatar,
    pronoun,
    setPronoun,
    customPronoun,
    setCustomPronoun,
    socialLinks,
    beforeUpload,
    handleAvatarChange,
    handleSave,
    updateName,
    updateEmail,
    updateBio,
    handleSocialLinkChange,
    isValidEmail
  };
};
