import { ProCard } from '@ant-design/pro-components';
import { Select } from 'antd';
import React from 'react';

const mockTypes = [
  { value: 'issue', label: 'Issue' },
  { value: 'pr', label: 'Pull Request' },
  { value: 'discussion', label: 'Discussion' },
];

interface TypeCardProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const TypeCard: React.FC<TypeCardProps> = ({ selectedType, setSelectedType }) => {
  return (
    <ProCard title="Type" bordered>
      <Select
        style={{ width: '100%' }}
        placeholder="Select type"
        value={selectedType}
        onChange={setSelectedType}
        options={mockTypes}
        showSearch
        optionFilterProp="label"
        allowClear
      />
    </ProCard>
  );
};

export default TypeCard;
