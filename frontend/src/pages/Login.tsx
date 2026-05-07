import React, { useState } from 'react';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, getApiErrorMessage } from '../lib/api';

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const res = await api.post('/api/login', values);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('欢迎回来！');
      navigate('/');
    } catch (error) {
      message.error(getApiErrorMessage(error, '登录失败，请检查邮箱和密码'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    message.info('忘记密码功能暂未开放，请联系管理员重置');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[3rem] transform -rotate-6 opacity-10"></div>

            {/* Content */}
            <div className="relative glass-effect p-12 rounded-[3rem] shadow-2xl">
              <h2 className="font-serif text-5xl font-bold text-gradient mb-6">
                欢迎回到野趣动物园
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                继续您在数字野生动物保护区的旅程。访问专属内容，追踪您喜爱的动物。
              </p>

              {/* Feature List */}
              <div className="space-y-4">
                {['追踪喜爱的动物', '访问会员专属内容', '参与保护活动'].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <div className="glass-effect p-10 md:p-12 rounded-[3rem] shadow-2xl">
            <div className="mb-10">
              <h1 className="font-serif text-4xl font-bold text-gray-800 mb-3">登录</h1>
              <p className="text-gray-600">输入您的账户信息</p>
            </div>

            <Form layout="vertical" onFinish={handleLogin} size="large">
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
                rules={[{ required: true, message: '请输入密码' }]}
                className="mb-6"
              >
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <Input.Password
                    placeholder="密码"
                    className="!pl-12 !rounded-2xl !h-14 !text-base !border-2 !border-gray-200 focus:!border-emerald-400"
                  />
                </div>
              </Form.Item>

              <div className="flex justify-between items-center mb-8">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-600">记住我</Checkbox>
                </Form.Item>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  忘记密码？
                </button>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                icon={<ArrowRight size={20} />}
                iconPosition="end"
                className="!rounded-2xl !h-16 !text-lg !font-semibold !shadow-xl hover:!shadow-2xl !transition-all !bg-gradient-to-r !from-emerald-600 !to-teal-600 !border-none mb-6"
              >
                登录
              </Button>
            </Form>

            <div className="text-center text-gray-600">
              还没有账户？{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
                立即注册
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
