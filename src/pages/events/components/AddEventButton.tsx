import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import CreateEventModal from './CreateEventModal';

interface AddEventButtonProps {
  onAddEvent: (values: any) => void;
}

const AddEventButton: React.FC<AddEventButtonProps> = ({ onAddEvent }) => {
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);

  const handleCreateEvent = (values: any) => {
    onAddEvent(values);
    setIsEventModalVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsEventModalVisible(true)}
      >
        Add Event
      </Button>

      <CreateEventModal
        visible={isEventModalVisible}
        onCancel={() => setIsEventModalVisible(false)}
        onSubmit={handleCreateEvent}
      />
    </>
  );
};

export default AddEventButton;
