import React from 'react';
import { Button } from 'antd';
import { Compass, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const fallbackImage = '/images/animal-placeholder.svg';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const userName = getStoredUserName();
  const isLoggedIn = Boolean(token);

  // 图片均来自 Pexels 搜索结果（狮子/大象/鸟/爬行动物/猴子/海洋动物）
  const categories = [
    {
      name: '狮子',
      to: '/animals?category=mammal&keyword=%E7%8B%AE',
      image: 'https://images.pexels.com/photos/34410507/pexels-photo-34410507.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=700',
    },
    {
      name: '大象',
      to: '/animals?category=mammal&keyword=%E8%B1%A1',
      image: 'https://images.pexels.com/photos/35365866/pexels-photo-35365866.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=700',
    },
    {
      name: '鸟类',
      to: '/animals?category=bird',
      image: 'https://images.pexels.com/photos/35729059/pexels-photo-35729059.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=700',
    },
    {
      name: '爬行动物',
      to: '/animals?category=reptile',
      image: 'https://images.pexels.com/photos/35679593/pexels-photo-35679593.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=700',
    },
    {
      name: '灵长类',
      to: '/animals?category=mammal&keyword=%E7%8C%B4',
      image: 'https://images.pexels.com/photos/35759209/pexels-photo-35759209.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=700',
    },
    {
      name: '水生动物',
      to: '/animals?category=aquatic',
      image: 'https://images.pexels.com/photos/35659857/pexels-photo-35659857.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=700',
    },
  ];

  return (
    <div className="bg-white">
      <section className="bg-emerald-900 overflow-hidden">
        <div className="container mx-auto px-0 md:px-6 py-6 md:py-8">
          <div
            className="relative rounded-none md:rounded-3xl overflow-hidden h-[300px] md:h-[400px] flex items-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/35725717/pexels-photo-35725717.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-900/40 to-transparent"></div>
            <div className="relative z-10 px-8 md:px-16 max-w-2xl text-white">
              <span className="bg-yellow-400 text-emerald-900 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-4 inline-block">新物种入住</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                探索 <br />神秘世界
              </h2>
              <p className="text-lg md:text-xl text-emerald-50 mb-8 max-w-lg">
                加入我们的虚拟探险之旅，以前所未有的方式体验野生动物。
              </p>
              <Button
                type="primary"
                size="large"
                className="!bg-white !text-emerald-900 !border-none !h-12 !px-8 !rounded-full !font-bold hover:!bg-emerald-50"
                onClick={() => navigate('/tour')}
              >
                开始参观
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <User size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {isLoggedIn ? `你好，${userName || '探险家'}！` : '你好，探险家！'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {isLoggedIn ? '已为你开启专属内容与收藏能力。' : '登录以获取专属内容。'}
                  </p>
                </div>
              </div>
              {isLoggedIn ? (
                <Link to="/animals">
                  <Button type="primary" className="!bg-emerald-600 !rounded-full !px-6 !font-bold">进入画廊</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button type="primary" className="!bg-emerald-600 !rounded-full !px-6 !font-bold">登录</Button>
                </Link>
              )}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Compass size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">虚拟参观</h3>
                  <p className="text-gray-500 text-sm">足不出户探索各大栖息地。</p>
                </div>
              </div>
              <Button onClick={() => navigate('/tour')} className="!rounded-full !px-6 !font-bold !border-blue-200 !text-blue-600">前往</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center md:text-left">你想见谁？</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className="flex flex-col items-center gap-3 cursor-pointer group"
                onClick={() => navigate(cat.to)}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent group-hover:border-emerald-500 transition-all shadow-md">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(event) => {
                      const target = event.currentTarget;
                      target.onerror = null;
                      target.src = fallbackImage;
                    }}
                  />
                </div>
                <span className="font-bold text-gray-700 group-hover:text-emerald-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 pb-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">保护的力量</h2>
              <p className="text-teal-50 text-lg mb-8">您的每一次访问都将为野生动物保护事业贡献一份力量。加入我们，共同守护全球濒危物种。</p>
              <Link to="/register">
                <Button size="large" className="!bg-white !text-teal-900 !border-none !rounded-full !font-bold">加入使命</Button>
              </Link>
            </div>
            <div className="relative z-10">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-1">150+</div>
                  <div className="text-sm uppercase tracking-widest opacity-80">受保护<br />物种</div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
