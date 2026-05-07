import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Avatar, message, Empty } from 'antd';
import { Send, User, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, getApiErrorMessage } from '../lib/api';


const { TextArea } = Input;

interface Message {
  id: number;
  content: string;
  nickname: string;
  created_at: string;
  user?: {
    name: string;
  };
}

interface GuestbookFormValues {
  nickname?: string;
  content: string;
}

const Guestbook: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/messages');
      setMessages(res.data);
    } catch (error) {
      message.error(getApiErrorMessage(error, '留言加载失败，请刷新重试'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (values: GuestbookFormValues) => {
    try {
      setSubmitting(true);
      await api.post('/api/messages', values);
      message.success('留言发布成功！');
      form.resetFields();
      await fetchMessages();
    } catch (error) {
      message.error(getApiErrorMessage(error, '留言发布失败，请稍后重试'));
    } finally {
      setSubmitting(false);
    }
  };

  const colors = ['bg-emerald-100 text-emerald-700', 'bg-teal-100 text-teal-700', 'bg-cyan-100 text-cyan-700', 'bg-blue-100 text-blue-700'];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <Sparkles size={16} className="text-emerald-600" />
            <span className="text-gray-700 text-sm font-medium">社区留言板</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-gradient mb-4">留言簿</h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            与我们的社区分享您的想法和体验
          </p>
        </motion.div>

        {/* Main Grid Layout - Tailwind Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-effect p-8 rounded-3xl sticky top-24 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-800">留下寄语</h3>
              </div>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  name="nickname"
                  label={<span className="font-medium text-gray-700">您的昵称</span>}
                >
                  <Input
                    placeholder="匿名"
                    size="large"
                    className="!rounded-xl"
                    prefix={<User size={16} className="text-gray-400 mr-1" />}
                  />
                </Form.Item>

                <Form.Item
                  name="content"
                  label={<span className="font-medium text-gray-700">留言内容</span>}
                  rules={[{ required: true, message: '请输入留言内容！' }]}
                >
                  <TextArea
                    rows={5}
                    placeholder="分享您的想法、体验或感谢..."
                    className="!rounded-xl"
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  block
                  size="large"
                  icon={<Send size={18} />}
                  className="!rounded-xl !h-14 !text-base !shadow-lg hover:!shadow-xl !transition-all !bg-gradient-to-r !from-emerald-600 !to-teal-600 !border-none font-medium"
                >
                  发布留言
                </Button>
              </Form>
            </div>
          </motion.div>

          {/* Messages Section */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
                />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20">
                <Empty
                  description={
                    <span className="text-gray-500">
                      还没有留言，快来成为第一个分享感想的人吧！
                    </span>
                  }
                />
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <Avatar
                        size={48}
                        className={`${colors[index % colors.length]} !font-bold shrink-0`}
                      >
                        {(item.nickname || item.user?.name || 'A')[0].toUpperCase()}
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-serif font-bold text-lg text-gray-800">
                            {item.nickname || item.user?.name || '匿名'}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0 ml-4">
                            {new Date(item.created_at).toLocaleDateString('zh-CN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
