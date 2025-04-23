import { ProCard } from '@ant-design/pro-components';
import { Avatar } from 'antd';
import React from 'react';

const ParticipantsCard: React.FC = () => {
  return (
    <ProCard title="Participants" bordered>
      <Avatar.Group maxCount={5}>
        <Avatar src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Janice" />
        <Avatar>K</Avatar>
        <Avatar>R</Avatar>
        <Avatar style={{ backgroundColor: '#87d068' }}>+2</Avatar>
      </Avatar.Group>
    </ProCard>
  );
};

export default ParticipantsCard;
