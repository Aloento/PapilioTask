import { Button, Card, Select, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface DefaultEmailSectionProps {
    email: string;
    setEmail: (email: string) => void;
    handleCustomRouting: () => void;
}

const DefaultEmailSection: React.FC<DefaultEmailSectionProps> = ({ email, setEmail, handleCustomRouting }) => (
    <Card style={{ marginBottom: 24 }}>
        <Title level={5}>Default notifications email</Title>
        <Paragraph>
            Choose where you'd like emails to be sent. You can add more email addresses. Use custom routes to specify
            different email addresses to be used for individual organizations.
        </Paragraph>
        <Select value={email} style={{ width: 300 }} onChange={setEmail}>
            <Option value="n563212895131017@outlook.com">n563212895131017@outlook.com</Option>
            <Option value="other@example.com">other@example.com</Option>
        </Select>
        <Button type="default" style={{ marginLeft: 8 }} onClick={handleCustomRouting}>
            Custom routing
        </Button>
    </Card>
);

export default DefaultEmailSection;
