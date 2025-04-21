import { Form, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import AddMilestoneModal from './components/AddMilestoneModal';
import MilestoneFilters from './components/MilestoneFilters';
import MilestoneItem from './components/MilestoneItem';
import { Event, Milestone } from './types';

const { Text } = Typography;

// Initial data
export const initialMilestones: Milestone[] = [
  {
    id: '1',
    title: '10.0.0',
    status: 'open',
    percent: 48,
    open: 1451,
    closed: 1387,
    updatedMinutesAgo: 5,
    description:
      'Preview, Release Candidates (RC), and General Availability (GA) releases for .NET 10',
  },
  {
    id: '2',
    title: 'Future',
    status: 'open',
    percent: 50,
    open: 6570,
    closed: 6788,
    updatedHoursAgo: 2,
  },
];

export const events: Event[] = [
  { id: 1, name: 'Sample Event', status: 'Ongoing' },
  { id: 2, name: 'AI Migration', status: 'Pending' },
  { id: 3, name: 'Legacy Phase-out', status: 'Finished' },
];

// Main component
const MilestonesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'open' | 'closed'>('open');
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [milestoneList, setMilestoneList] = useState<Milestone[]>(initialMilestones);
  const [form] = Form.useForm();

  const handleAddMilestone = () => {
    form.validateFields().then((values) => {
      // Generate unique ID
      const newId = `milestone-${Date.now()}`;
      const selectedEvent = events.find((e) => e.id === values.eventId);

      const newMilestone: Milestone = {
        id: newId,
        title: values.name,
        status: 'open',
        percent: 0,
        open: 0,
        closed: 0,
        updatedMinutesAgo: 0,
        eventId: values.eventId,
        description: values.description ||
          `Associated event: ${selectedEvent?.name || 'Not specified'}`,
      };

      setMilestoneList([newMilestone, ...milestoneList]);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredMilestones = useMemo(
    () =>
      milestoneList.filter(
        (m) =>
          m.status === statusFilter &&
          m.title.toLowerCase().includes(searchText.toLowerCase())
      ),
    [statusFilter, searchText, milestoneList]
  );

  const openCount = milestoneList.filter((m) => m.status === 'open').length;
  const closedCount = milestoneList.filter((m) => m.status === 'closed').length;

  return (
    <div style={{ padding: 24 }}>
      <MilestoneFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        openCount={openCount}
        closedCount={closedCount}
        onAddMilestone={() => setIsModalVisible(true)}
      />

      <div style={{ background: '#fff', border: '1px solid #d8dee4', borderRadius: 6 }}>
        {filteredMilestones.length > 0 ? (
          filteredMilestones.map((milestone, index) => (
            <MilestoneItem
              key={milestone.id || milestone.title}
              milestone={milestone}
              index={index}
            />
          ))
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Text type="secondary">No matching milestones found</Text>
          </div>
        )}
      </div>

      <AddMilestoneModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddMilestone}
        form={form}
        events={events}
      />
    </div>
  );
};

export default MilestonesPage;
