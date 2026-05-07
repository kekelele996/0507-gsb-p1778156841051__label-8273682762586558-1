import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Lock, Mail, User, ArrowRight, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, getApiErrorMessage } from '../lib/api';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      const res = await api.post('/api/register', values);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('账户创建成功！');
      navigate('/');
    } catch (error) {
      message.error(getApiErrorMessage(error, '注册失败，请检查输入信息后重试'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full order-2 lg:order-1"
        >
          <div className="glass-effect p-10 md:p-12 rounded-[3rem] shadow-2xl">
            <div className="mb-10">
              <h1 className="font-serif text-4xl font-bold text-gray-800 mb-3">加入野趣动物园</h1>
              <p className="text-gray-600">创建账户，开启您的保护之旅</p>
            </div>

            <Form layout="vertical" onFinish={handleRegister} size="large">
              <Form.Item
                name="name"
                rules={[{ required: true, message: '请输入您的姓名' }]}
                className="mb-6"
              >
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <Input
                    placeholder="姓名"
                    className="!pl-12 !rounded-2xl !h-14 !text-base !border-2 !border-gray-200 focus:!border-emerald-400"
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址' }]}
                className="mb-6"
              >
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <Input
                    placeholder="邮箱地址"
                    className="!pl-12 !rounded-2xl !h-14 !text-base !border-2 !border-gray-200 focus:!border-emerald-400"
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, min: 8, message: '密码至少8个字符' }]}
                className="mb-6"
              >
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <Input.Password
                    placeholder="密码（至少8位）"
                    className="!pl-12 !rounded-2xl !h-14 !text-base !border-2 !border-gray-200 focus:!border-emerald-400"
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码输入不一致！'));
                    },
                  }),
                ]}
                className="mb-8"
              >
                <div className="relative">
                  <Shield size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <Input.Password
                    placeholder="确认密码"
                    className="!pl-12 !rounded-2xl !h-14 !text-base !border-2 !border-gray-200 focus:!border-emerald-400"
                  />
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                icon={<ArrowRight size={20} />}
                iconPosition="end"
                className="!rounded-2xl !h-16 !text-lg !font-semibold !shadow-xl hover:!shadow-2xl !transition-all !bg-gradient-to-r !from-emerald-600 !to-teal-600 !border-none mb-6"
              >
                创建账户
              </Button>
            </Form>

            <div className="text-center text-gray-600">
              已有账户？{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
                立即登录
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block order-1 lg:order-2"
        >
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[3rem] transform rotate-6 opacity-10"></div>

            {/* Content */}
            <div className="relative glass-effect p-12 rounded-[3rem] shadow-2xl">
              <h2 className="font-serif text-5xl font-bold text-gradient mb-6">
                开启您的旅程
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                加入成千上万的自然爱好者，通过我们的沉浸式平台为野生动物保护贡献力量。
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  { title: '专属内容', desc: '访问高级野生动物媒体' },
                  { title: '社区互动', desc: '与同好们交流' },
                  { title: '影响追踪', desc: '了解您的保护影响力' }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex gap-4 p-4 bg-white/50 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-white text-xl font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-gray-800 mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
