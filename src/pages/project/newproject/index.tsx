import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface ProjectFormValues {
  projectName: string;
}

const CreateProjectPage: React.FC = () => {
  const [form] = Form.useForm<ProjectFormValues>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCreate = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Creating project:", values.projectName);
      // API call would go here
      // await createProject(values.projectName);
      navigate('/project/board');
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ projectName: '' }}
        >
          <Row gutter={32}>
            {/* Left Panel - Information */}
            <Col span={8}>
              <Title level={5}>New board</Title>
              <Paragraph>
                Start with a board to spread your issues and pull requests across customizable
                columns. Easily switch to a table or roadmap layout at any time.
              </Paragraph>
            </Col>

            {/* Right Panel - Form */}
            <Col span={16}>
              <Form.Item
                name="projectName"
                label={<Title level={5} style={{ margin: 0 }}>Project name</Title>}
                rules={[
                  { required: true, message: 'Please enter a project name' },
                  { max: 50, message: 'Project name cannot exceed 50 characters' }
                ]}
              >
                <Input
                  placeholder="e.g. @yourname's awesome project"
                  maxLength={50}
                />
              </Form.Item>

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Space>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Create project
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProjectPage;
