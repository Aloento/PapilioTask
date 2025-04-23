import { Flex } from 'antd';
import React, { useState } from 'react';
import { EventData } from '../types';
import AssigneesCard from './AssigneesCard';
import LabelsCard from './LabelsCard';
import MilestoneCard from './MilestoneCard';
import NotificationCard from './NotificationCard';
import ParticipantsCard from './ParticipantsCard';
import ProjectsCard from './ProjectsCard';
import TypeCard from './TypeCard';

// 侧边栏信息组件
const SidebarInfo: React.FC<{ event: EventData }> = ({ event }) => {
  // 状态管理
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(event.assignees || []);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(event.labels || []);
  const [selectedType, setSelectedType] = useState<string>(event.type || '');
  const [selectedProject, setSelectedProject] = useState<string>(event.project || '');
  const [selectedMilestone, setSelectedMilestone] = useState<string>(event.milestone || '');

  return (
    <Flex vertical gap={16} style={{ width: 300 }}>
      <AssigneesCard
        selectedAssignees={selectedAssignees}
        setSelectedAssignees={setSelectedAssignees}
      />

      <LabelsCard
        selectedLabels={selectedLabels}
        setSelectedLabels={setSelectedLabels}
      />

      <TypeCard
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <ProjectsCard
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      <MilestoneCard
        selectedMilestone={selectedMilestone}
        setSelectedMilestone={setSelectedMilestone}
      />

      <NotificationCard />

      <ParticipantsCard />
    </Flex>
  );
};

export default SidebarInfo;
