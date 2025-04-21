import { Card, Typography } from 'antd';
import React from 'react';
import { Label } from '../types';
import LabelItem from './LabelItem';

const { Text } = Typography;

const LabelsList: React.FC<{
  labels: Label[];
  onSelectLabel: (name: string) => void;
}> = ({ labels, onSelectLabel }) => (
  <>
    <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
      {labels.length} labels
    </Text>
    <Card bordered style={{ borderRadius: 10 }}>
      {labels.map((label) => (
        <LabelItem key={label.name} label={label} onSelect={onSelectLabel} />
      ))}
    </Card>
  </>
);

export default LabelsList;
