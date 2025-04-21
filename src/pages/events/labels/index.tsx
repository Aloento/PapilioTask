import { Card } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import IssuesList from './components/IssuesList';
import LabelsList from './components/LabelsList';
import PageHeader from './components/PageHeader';
import { fetchIssueList, fetchLabelList } from './service';
import { Issue, Label } from './types';

// 主页面组件
const LabelsPage: React.FC = () => {
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [allLabels, setAllLabels] = useState<Label[]>([]);
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);

  // 数据加载
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [labels, issues] = await Promise.all([
          fetchLabelList(),
          fetchIssueList()
        ]);
        setAllLabels(labels);
        setAllIssues(issues);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤逻辑
  const filteredLabels = useMemo(() => {
    return allLabels.filter((l) =>
      l.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, allLabels]);

  const filteredIssues = useMemo(() => {
    if (!selectedLabel) return [];
    return allIssues.filter((i) => i.labels.includes(selectedLabel));
  }, [selectedLabel, allIssues]);

  return (
    <div style={{ padding: 24 }}>
      <PageHeader
        selectedLabel={selectedLabel}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
      />

      {loading ? (
        <Card loading={true} />
      ) : selectedLabel ? (
        <IssuesList
          issues={filteredIssues}
          selectedLabel={selectedLabel}
          onBackClick={() => setSelectedLabel(null)}
        />
      ) : (
        <LabelsList
          labels={filteredLabels}
          onSelectLabel={setSelectedLabel}
        />
      )}
    </div>
  );
};

export default LabelsPage;
