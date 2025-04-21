import { Button, Space } from 'antd';
import React from 'react';

interface MilestoneTabsProps {
  activeTab: 'open' | 'closed';
  onTabChange: (tab: 'open' | 'closed') => void;
  openCount: number;
  closedCount: number;
}

const MilestoneTabs: React.FC<MilestoneTabsProps> = ({
  activeTab,
  onTabChange,
  openCount,
  closedCount,
}) => {
  return (
    <div
      style={{
        border: '1px solid #d8dee4',
        borderRadius: 6,
        background: '#f6f8fa',
        padding: '8px 16px',
        marginBottom: 0,
      }}
    >
      <Space>
        <Button
          type="text"
          onClick={() => onTabChange('open')}
          style={{
            fontWeight: activeTab === 'open' ? 600 : 400,
            background: activeTab === 'open' ? '#fff' : 'transparent',
            border: activeTab === 'open' ? '1px solid #d0d7de' : 'none',
            borderRadius: 20,
            padding: '4px 16px',
          }}
        >
          Open ({openCount})
        </Button>
        <Button
          type="text"
          onClick={() => onTabChange('closed')}
          style={{
            fontWeight: activeTab === 'closed' ? 600 : 400,
            background: activeTab === 'closed' ? '#fff' : 'transparent',
            border: activeTab === 'closed' ? '1px solid #d0d7de' : 'none',
            borderRadius: 20,
            padding: '4px 16px',
          }}
        >
          Closed ({closedCount})
        </Button>
      </Space>
    </div>
  );
};

export default MilestoneTabs;
