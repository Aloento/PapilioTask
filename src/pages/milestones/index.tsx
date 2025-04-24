import { Form, Typography, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import AddMilestoneModal from './components/AddMilestoneModal';
import MilestoneFilters from './components/MilestoneFilters';
import MilestoneItem from './components/MilestoneItem';
import { createMilestone, deleteMilestone, getMilestones, updateMilestone } from './service';
import { Event, Milestone } from './types';

const { Text } = Typography;

export const events: Event[] = [
  { id: 1, name: 'Sample Event', status: 'Ongoing' },
  { id: 2, name: 'AI Migration', status: 'Pending' },
  { id: 3, name: 'Legacy Phase-out', status: 'Finished' },
];

const MilestonesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'open' | 'closed'>('open');
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [milestoneList, setMilestoneList] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [form] = Form.useForm();

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const data = await getMilestones({
        status: statusFilter,
        query: searchText
      });
      setMilestoneList(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('获取里程碑列表失败');
      setMilestoneList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [statusFilter, searchText]);

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: milestone.title,
      description: milestone.description,
      eventId: milestone.eventId,
    });
  };

  const handleDeleteMilestone = async (milestone: Milestone) => {
    try {
      await deleteMilestone(Number(milestone.id));
      message.success('里程碑删除成功');
      fetchMilestones();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSaveMilestone = async (values: any) => {
    try {
      if (editingMilestone) {
        await updateMilestone(Number(editingMilestone.id), {
          title: values.name,
          description: values.description,
          eventId: values.eventId,
        });
        message.success('里程碑更新成功');
      } else {
        await createMilestone({
          title: values.name,
          description: values.description,
          eventId: values.eventId,
          status: 'open',
        });
        message.success('里程碑创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingMilestone(null);
      fetchMilestones();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleAddMilestone = async () => {
    try {
      const values = await form.validateFields();
      await createMilestone({
        title: values.name,
        description: values.description,
        eventId: values.eventId,
        status: 'open',
        percent: 0,
        openCount: 0,
        closedCount: 0
      });
      message.success('创建里程碑成功');
      setIsModalVisible(false);
      form.resetFields();
      fetchMilestones(); // 刷新列表
    } catch (error) {
      message.error('创建里程碑失败');
    }
  };

  const filteredMilestones = useMemo(
    () =>
      Array.isArray(milestoneList)
        ? milestoneList.filter((m) => {
          if (!m || typeof m.title !== 'string') return false;
          return (
            m.status === statusFilter &&
            (searchText
              ? m.title.toLowerCase().includes(searchText.toLowerCase())
              : true)
          );
        })
        : [],
    [milestoneList, statusFilter, searchText]
  );

  const openCount = (Array.isArray(milestoneList) ? milestoneList : [])
    .filter((m) => m?.status === 'open').length;
  const closedCount = (Array.isArray(milestoneList) ? milestoneList : [])
    .filter((m) => m?.status === 'closed').length;

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
              onEdit={handleEditMilestone}
              onDelete={handleDeleteMilestone}
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
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onSubmit={handleAddMilestone}
        form={form}
        events={events}
        editingMilestone={editingMilestone}
      />
    </div>
  );
};

export default MilestonesPage;
