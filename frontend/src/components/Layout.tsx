import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { Search, User, ChevronDown, PawPrint, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const getStoredUserName = (): string => {
  try {
    const raw = localStorage.getItem('user');

    if (!raw) {
      return '';
    }

    const parsed = JSON.parse(raw) as { name?: string };
    return parsed.name?.trim() || '';
  } catch {
    return '';
  }
};

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const userName = getStoredUserName();
  const isLoggedIn = Boolean(token);

  const navItems = [
    { label: '哺乳动物', to: '/animals?category=mammal' },
    { label: '鸟类', to: '/animals?category=bird' },
    { label: '爬行动物', to: '/animals?category=reptile' },
    { label: '栖息地', to: '/animals?habitat=savanna' },
    { label: '虚拟参观', to: '/tour' },
    { label: '保护活动', to: '/guestbook' },
  ];

  const handleSubscribe = () => {
    const email = subscribeEmail.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      message.error('请输入有效邮箱地址');
      return;
    }

    setSubscribeEmail('');
    message.success('订阅成功，感谢关注保护动态');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('已退出登录');
    navigate('/login');
  };

  const notifyComingSoon = (feature: string) => {
    message.info(`${feature} 正在开发中`);
  };

  const isItemActive = (target: string): boolean => {
    if (target === '/guestbook' || target === '/tour') {
      return location.pathname === target;
    }

    if (target.startsWith('/animals?')) {
      return location.pathname === '/animals' && location.search === target.replace('/animals', '');
    }

    return location.pathname === target;
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_auto_1fr_auto] bg-gray-50 font-sans">
      {/* 顶部工具栏 */}
      <div className="bg-emerald-900 text-white text-xs py-2 px-6">
        <div className="container mx-auto flex justify-between items-center">
            <span>24小时 野生动物保护热线</span>
            <div className="flex gap-4">
                <Link to="/tour" className="hover:underline">免费虚拟参观</Link>
                <Link to="/guestbook" className="hover:underline">保护动态</Link>
            </div>
        </div>
      </div>

      {/* 主头部 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 grid grid-cols-[auto_1fr_auto] gap-8 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                     <PawPrint size={24} />
                </div>
                <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">野趣动物园</h1>
            </Link>

            {/* 搜索栏 */}
            <div className="max-w-2xl w-full">
                <Input
                    size="large"
                    placeholder="搜索动物、栖息地或文章..."
                    prefix={<Search size={18} className="text-gray-400 mr-2" />}
                    className="!rounded-full !bg-gray-100 !border-transparent focus:!bg-white focus:!border-emerald-500 hover:!bg-white !h-12 !text-base"
                />
            </div>

            {/* 账户 / 操作 */}
            <div className="flex items-center gap-6">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <User size={20} />
                    <div className="hidden lg:block text-sm leading-tight text-left">
                      <div>已登录</div>
                      <div className="font-bold">{userName || '我的账户'}</div>
                    </div>
                    <Button type="link" size="small" onClick={handleLogout} className="!px-1 !text-emerald-700">
                      退出
                    </Button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 font-medium">
                    <User size={20} />
                    <div className="hidden lg:block text-sm leading-tight text-left">
                      <div>登录</div>
                      <div className="font-bold">我的账户</div>
                    </div>
                    <ChevronDown size={14} className="hidden lg:block text-gray-400" />
                  </Link>
                )}
                <Link to="/guestbook" className="flex items-center gap-2 text-gray-700 hover:text-emerald-700 font-medium">
                    <div className="relative">
                        <BookOpen size={24} />
                    </div>
                    <div className="hidden lg:block text-sm leading-tight text-left">
                         <div className="font-bold">留言簿</div>
                    </div>
                </Link>
            </div>
        </div>

        {/* 二级导航 (分类) */}
        <div className="border-t border-gray-100">
            <div className="container mx-auto px-6">
                <nav className="flex items-center gap-8 py-3 text-sm font-bold text-gray-600 overflow-x-auto">
                    <Link to="/" className={`whitespace-nowrap hover:text-emerald-600 ${location.pathname === '/' ? 'text-emerald-600' : ''}`}>
                        首页
                    </Link>
                    <Link to="/animals" className={`whitespace-nowrap hover:text-emerald-600 ${location.pathname === '/animals' ? 'text-emerald-600' : ''}`}>
                        动物画廊
                    </Link>
                    <div className="w-px h-4 bg-gray-300 mx-2"></div>
                    {navItems.map((item) => {
                      const active = isItemActive(item.to);

                      return (
                        <Link
                          key={item.label}
                          to={item.to}
                          className={`whitespace-nowrap hover:text-emerald-600 ${active ? 'text-emerald-600' : item.label === '保护活动' ? 'text-rose-600' : ''}`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                </nav>
            </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 border-t border-gray-200 text-gray-600 py-16 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
             <div>
                <h4 className="font-bold text-gray-900 mb-4">关于野趣动物园</h4>
                <ul className="space-y-2 text-sm">
                    <li><button type="button" onClick={() => notifyComingSoon('我们的使命')} className="hover:underline text-left bg-transparent border-none p-0">我们的使命</button></li>
                    <li><button type="button" onClick={() => notifyComingSoon('加入我们')} className="hover:underline text-left bg-transparent border-none p-0">加入我们</button></li>
                    <li><button type="button" onClick={() => notifyComingSoon('新闻中心')} className="hover:underline text-left bg-transparent border-none p-0">新闻中心</button></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-gray-900 mb-4">探索</h4>
                 <ul className="space-y-2 text-sm">
                    <li><Link to="/animals" className="hover:underline">动物画廊</Link></li>
                    <li><Link to="/guestbook" className="hover:underline">留言簿</Link></li>
                    <li><Link to="/tour" className="hover:underline">虚拟参观</Link></li>
                </ul>
             </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">帮助与支持</h4>
                 <ul className="space-y-2 text-sm">
                    <li><button type="button" onClick={() => notifyComingSoon('联系我们')} className="hover:underline text-left bg-transparent border-none p-0">联系我们</button></li>
                    <li><button type="button" onClick={() => notifyComingSoon('常见问题')} className="hover:underline text-left bg-transparent border-none p-0">常见问题</button></li>
                    <li><button type="button" onClick={() => notifyComingSoon('无障碍服务')} className="hover:underline text-left bg-transparent border-none p-0">无障碍服务</button></li>
                </ul>
             </div>
             <div>
                 <h4 className="font-bold text-gray-900 mb-4">保持联系</h4>
                 <p className="text-sm mb-4">订阅我们的邮件，获取每日野生动物资讯。</p>
                 <div className="flex gap-2">
                     <Input
                       placeholder="邮箱地址"
                       value={subscribeEmail}
                       onChange={(event) => setSubscribeEmail(event.target.value)}
                       onPressEnter={handleSubscribe}
                     />
                     <Button type="primary" className="bg-emerald-600" onClick={handleSubscribe}>订阅</Button>
                 </div>
             </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-200 text-center text-sm">
            © {new Date().getFullYear()} 野趣动物园. 保留所有权利.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
