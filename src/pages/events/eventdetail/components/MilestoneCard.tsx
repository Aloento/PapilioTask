import { ProCard } from '@ant-design/pro-components';
import { Select } from 'antd';
import React from 'react';

const mockMilestones = [
  { value: 'v1.0', label: 'Version 1.0' },
  { value: 'v1.1', label: 'Version 1.1' },
  { value: 'v2.0', label: 'Version 2.0' },
];

interface MilestoneCardProps {
  selectedMilestone: string;
  setSelectedMilestone: (milestone: string) => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ selectedMilestone, setSelectedMilestone }) => {
  return (
    <ProCard title="Milestone" bordered>
      <Select
        style={{ width: '100%' }}
        placeholder="Select milestone"
        value={selectedMilestone}
        onChange={setSelectedMilestone}
        options={mockMilestones}
        showSearch
        optionFilterProp="label"
        allowClear
      />
    </ProCard>
  );
};

export default MilestoneCard;
