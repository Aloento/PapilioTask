import { ProCard } from '@ant-design/pro-components';
import { Select } from 'antd';
import React from 'react';

const mockProjects = [
  { value: 'project1', label: 'Project One' },
  { value: 'project2', label: 'Project Two' },
  { value: 'project3', label: 'Project Three' },
];

interface ProjectsCardProps {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
}

const ProjectsCard: React.FC<ProjectsCardProps> = ({ selectedProject, setSelectedProject }) => {
  return (
    <ProCard title="Projects" bordered>
      <Select
        style={{ width: '100%' }}
        placeholder="Select project"
        value={selectedProject}
        onChange={setSelectedProject}
        options={mockProjects}
        showSearch
        optionFilterProp="label"
        allowClear
      />
    </ProCard>
  );
};

export default ProjectsCard;
