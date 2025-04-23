import { CloseOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Button, FloatButton, Input, List, Modal, Progress, Spin, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { usePapilioChat } from '../services/llm';
import './AIAssistant.css';

const { TextArea } = Input;
const { Text } = Typography;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage, loadingProgress } = usePapilioChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到对话底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage];
      const { stream } = sendMessage(history);

      if (!stream) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '抱歉，AI模型尚未准备好。请稍后再试。'
        }]);
        setIsLoading(false);
        return;
      }

      let assistantResponse = '';
      for await (const chunk of await stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        assistantResponse += content;

        setMessages(prev => {
          const newMessages = [...prev];
          // 如果已经有助手回复，则更新它
          if (newMessages[newMessages.length - 1]?.role === 'assistant') {
            newMessages[newMessages.length - 1].content = assistantResponse;
          } else {
            // 否则添加新的助手消息
            newMessages.push({ role: 'assistant', content: assistantResponse });
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isModelLoading = loadingProgress < 100;

  return (
    <>
      <FloatButton
        icon={<RobotOutlined />}
        type="primary"
        onClick={handleOpen}
        tooltip={isModelLoading ? `AI助手 (加载中: ${loadingProgress}%)` : "AI助手"}
        className="ai-assistant-button"
      />

      <Modal
        title={
          <div className="chat-header">
            <RobotOutlined /> <span>PapilioTask AI助手</span>
          </div>
        }
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width={400}
        className="ai-chat-modal"
        closeIcon={<CloseOutlined />}
      >
        {isModelLoading ? (
          <div className="model-loading-container">
            <Spin size="large" />
            <Typography.Title level={5} style={{ marginTop: 16 }}>
              AI模型加载中...
            </Typography.Title>
            <Progress percent={loadingProgress} status="active" />
            <Typography.Text type="secondary">
              首次加载可能需要几分钟，请耐心等待
            </Typography.Text>
          </div>
        ) : (
          <>
            <div className="chat-container">
              {messages.length === 0 ? (
                <div className="empty-chat-message">
                  <Typography.Text type="secondary">
                    你好！我是PapilioTask AI助手，有什么可以帮助你的？
                  </Typography.Text>
                </div>
              ) : (
                <>
                  <List
                    className="message-list"
                    itemLayout="horizontal"
                    dataSource={messages}
                    renderItem={(message) => (
                      <List.Item className={`message-item ${message.role}`}>
                        <List.Item.Meta
                          avatar={message.role === 'user' ?
                            <Avatar style={{ backgroundColor: '#1890ff' }}>我</Avatar> :
                            <Avatar style={{ backgroundColor: '#52c41a' }}><RobotOutlined /></Avatar>
                          }
                          children={<div className="message-content">{message.content}</div>}
                        />
                      </List.Item>
                    )}
                  />
                  <div ref={messagesEndRef} />

                  {isLoading && (
                    <div className="loading-indicator">
                      <Spin size="small" />
                      <Text type="secondary" style={{ marginLeft: 8 }}>AI正在思考...</Text>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="input-container">
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="有什么可以帮助你的？"
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={isLoading || isModelLoading}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || isModelLoading}
                className="send-button"
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default AIAssistant;
