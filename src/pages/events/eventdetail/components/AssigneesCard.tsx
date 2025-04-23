import { ProCard } from '@ant-design/pro-components';
import { Select } from 'antd';
import React from 'react';

const mockAssignees = [
  { value: 'user1', label: 'User One' },
  { value: 'user2', label: 'User Two' },
  { value: 'user3', label: 'User Three' },
  { value: 'user4', label: 'User Four' },
];

interface AssigneesCardProps {
  selectedAssignees: string[];
  setSelectedAssignees: (assignees: string[]) => void;
}

const AssigneesCard: React.FC<AssigneesCardProps> = ({ selectedAssignees, setSelectedAssignees }) => {
  return (
    <ProCard title="Assignees" bordered>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select assignees"
        value={selectedAssignees}
        onChange={setSelectedAssignees}
        options={mockAssignees}
        showSearch
        optionFilterProp="label"
      />
    </ProCard>
  );
};

export default AssigneesCard;
