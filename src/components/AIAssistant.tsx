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

  // Automatically scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add body class name when Modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('ai-chat-modal-open');
    } else {
      document.body.classList.remove('ai-chat-modal-open');
    }

    return () => {
      document.body.classList.remove('ai-chat-modal-open');
    };
  }, [isOpen]);

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
          content: 'Sorry, the AI model is not ready yet. Please try again later.'
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
          // If there is already an assistant reply, update it
          if (newMessages[newMessages.length - 1]?.role === 'assistant') {
            newMessages[newMessages.length - 1].content = assistantResponse;
          } else {
            // Otherwise, add a new assistant message
            newMessages.push({ role: 'assistant', content: assistantResponse });
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered some issues. Please try again later.'
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
        tooltip={isModelLoading ? `AI Assistant (Loading: ${loadingProgress}%)` : "AI Assistant"}
        className="ai-assistant-button"
      />

      <Modal
        title={
          <div className="chat-header">
            <RobotOutlined /> <span>PapilioTask AI Assistant</span>
          </div>
        }
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width={450}
        className="ai-chat-modal"
        closeIcon={<CloseOutlined />}
        mask={false}
        maskClosable={false}
        centered={false}
        wrapClassName="ai-chat-modal-wrapper"
        destroyOnClose={false}
        getContainer={false}  // Do not mount Modal to body to avoid scrolling issues
        styles={{
          body: {
            width: '350px',
            overflowX: 'hidden'
          }
        }}
      >
        {isModelLoading ? (
          <div className="model-loading-container">
            <Spin size="large" />
            <Typography.Title level={5} style={{ marginTop: 16 }}>
              AI Model Loading...
            </Typography.Title>
            <Progress percent={loadingProgress} status="active" />
            <Typography.Text type="secondary">
              Initial loading may take a few minutes, please be patient
            </Typography.Text>
          </div>
        ) : (
          <>
            <div className="chat-container">
              {messages.length === 0 ? (
                <div className="empty-chat-message">
                  <Typography.Text type="secondary">
                    Hello! I am PapilioTask AI Assistant.
                    <br />
                    How can I assist you?
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
                            <Avatar style={{ backgroundColor: '#1890ff' }}>Me</Avatar> :
                            <Avatar style={{ backgroundColor: '#52c41a' }}><RobotOutlined /></Avatar>
                          }
                          description={<div className="message-content">{message.content}</div>}
                        />
                      </List.Item>
                    )}
                  />
                  <div ref={messagesEndRef} />

                  {isLoading && (
                    <div className="loading-indicator">
                      <Spin size="small" />
                      <Text type="secondary" style={{ marginLeft: 8 }}>AI is thinking...</Text>
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
                placeholder="How can I help you?"
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
