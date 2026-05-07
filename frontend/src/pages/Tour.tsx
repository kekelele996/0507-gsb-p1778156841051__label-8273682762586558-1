import React from 'react';
import { Button, message } from 'antd';
import { Compass, MapPinned } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface Habitat {
  value: string;
  name: string;
  description: string;
  image: string;
}

const habitats: Habitat[] = [
  {
    value: 'savanna',
    name: '热带草原',
    description: '狮子、斑马与大象的家园，开阔地带最适合观察群居动物。',
    image: 'https://images.pexels.com/photos/35725717/pexels-photo-35725717.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200',
  },
  {
    value: 'rainforest',
    name: '热带雨林',
    description: '树冠层到地表层充满生命，灵长类与两栖动物非常活跃。',
    image: 'https://images.pexels.com/photos/35759209/pexels-photo-35759209.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200',
  },
  {
    value: 'arctic',
    name: '北极冰原',
    description: '极地生态系统的生存挑战，观察耐寒动物的适应策略。',
    image: 'https://images.pexels.com/photos/35287793/pexels-photo-35287793.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200',
  },
  {
    value: 'ocean',
    name: '海洋世界',
    description: '沉浸式海洋观测路线，快速定位水生动物与保护知识。',
    image: 'https://images.pexels.com/photos/35659857/pexels-photo-35659857.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200',
  },
];

const Tour: React.FC = () => {
  const navigate = useNavigate();

  const enterHabitat = (habitat: Habitat) => {
    navigate(`/animals?habitat=${habitat.value}`);
    message.success(`已进入${habitat.name}展区`);
  };

  return (
    <div className="min-h-screen py-14">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium mb-5">
            <Compass size={16} />
            虚拟参观已上线
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gradient mb-4">选择你的参观路线</h1>
          <p className="text-gray-600 text-lg">
            每个展区都可直接联动到画廊筛选，你可以从栖息地快速进入对应动物列表。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {habitats.map((habitat, index) => (
            <motion.div
              key={habitat.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl overflow-hidden border border-emerald-100 bg-white shadow-lg"
            >
              <div className="h-52 overflow-hidden">
                <img src={habitat.image} alt={habitat.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <MapPinned size={16} />
                  <span className="font-medium">{habitat.name}</span>
                </div>
                <p className="text-gray-600 mb-5 leading-relaxed">{habitat.description}</p>
                <Button
                  type="primary"
                  className="!rounded-xl !bg-emerald-600 !border-none"
                  onClick={() => enterHabitat(habitat)}
                >
                  进入展区
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/">
            <Button className="!rounded-xl !px-6">返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tour;
