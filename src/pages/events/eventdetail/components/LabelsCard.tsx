import { ProCard } from '@ant-design/pro-components';
import { Select, Tag } from 'antd';
import React from 'react';

const mockLabels = [
  { value: 'bug', label: 'Bug', color: 'red' },
  { value: 'feature', label: 'Feature', color: 'green' },
  { value: 'enhancement', label: 'Enhancement', color: 'blue' },
  { value: 'documentation', label: 'Documentation', color: 'orange' },
];

interface LabelsCardProps {
  selectedLabels: string[];
  setSelectedLabels: (labels: string[]) => void;
}

const LabelsCard: React.FC<LabelsCardProps> = ({ selectedLabels, setSelectedLabels }) => {
  return (
    <ProCard title="Labels" bordered>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select labels"
        value={selectedLabels}
        onChange={setSelectedLabels}
        options={mockLabels}
        showSearch
        optionFilterProp="label"
        tagRender={(props) => {
          const { label, value, closable, onClose } = props;
          const labelItem = mockLabels.find((item) => item.value === value);
          return (
            <Tag color={labelItem?.color || 'magenta'} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
              {label}
            </Tag>
          );
        }}
      />
    </ProCard>
  );
};

export default LabelsCard;
