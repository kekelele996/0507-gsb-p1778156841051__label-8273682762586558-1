import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Tag,
  message,
} from 'antd';
import { MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { api, getApiErrorMessage } from '../lib/api';

interface Animal {
  id: number;
  name: string;
  species: string;
  description: string;
  image_url: string;
  status: 'available' | 'adopted';
  habitat?: string | null;
  category?: string | null;
}

interface AnimalFormValues {
  name: string;
  species: string;
  description?: string;
  image_url?: string;
  status: 'available' | 'adopted';
  habitat?: string;
  category?: string;
}

const FALLBACK_IMAGE = '/images/animal-placeholder.svg';
const IMAGE_URL_HINT = '建议使用 Pexels 搜索结果中的下载直链：https://images.pexels.com/photos/xxx/pexels-photo-xxx.jpeg';

const CATEGORY_OPTIONS = [
  { label: '全部分类', value: 'all' },
  { label: '哺乳动物', value: 'mammal' },
  { label: '鸟类', value: 'bird' },
  { label: '爬行动物', value: 'reptile' },
  { label: '两栖动物', value: 'amphibian' },
  { label: '水生动物', value: 'aquatic' },
];

const HABITAT_OPTIONS = [
  { label: '全部栖息地', value: 'all' },
  { label: '热带草原', value: 'savanna' },
  { label: '热带雨林', value: 'rainforest' },
  { label: '北极冰原', value: 'arctic' },
  { label: '海洋', value: 'ocean' },
  { label: '沙漠', value: 'desert' },
  { label: '湿地', value: 'wetland' },
];

const statusLabelMap: Record<Animal['status'], string> = {
  available: '可参观',
  adopted: '已认养',
};

const normalize = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }

  return value.trim().toLowerCase();
};

const inferCategory = (animal: Animal): string => {
  const category = normalize(animal.category);

  if (category) {
    return category;
  }

  const species = normalize(animal.species);

  if (species.includes('鸟') || species.includes('bird')) {
    return 'bird';
  }

  if (species.includes('蛇') || species.includes('蜥蜴') || species.includes('reptile')) {
    return 'reptile';
  }

  if (species.includes('蛙') || species.includes('salamander') || species.includes('amphibian')) {
    return 'amphibian';
  }

  if (species.includes('鱼') || species.includes('海') || species.includes('aquatic')) {
    return 'aquatic';
  }

  return 'mammal';
};

const inferHabitat = (animal: Animal): string => {
  const habitat = normalize(animal.habitat);

  if (habitat) {
    return habitat;
  }

  const species = normalize(animal.species);

  if (species.includes('北极') || species.includes('polar') || species.includes('arctic')) {
    return 'arctic';
  }

  if (species.includes('象') || species.includes('狮') || species.includes('斑马') || species.includes('savanna')) {
    return 'savanna';
  }

  if (species.includes('海') || species.includes('鱼') || species.includes('ocean')) {
    return 'ocean';
  }

  if (species.includes('鳄') || species.includes('湿地') || species.includes('wetland')) {
    return 'wetland';
  }

  return 'rainforest';
};

const buildImageUrlError = (rawMessage: string): string => {
  const messageText = rawMessage.toLowerCase();

  if (
    messageText.includes('image') ||
    messageText.includes('url') ||
    messageText.includes('链接')
  ) {
    return '图片 URL 无效，请输入可直接访问的 http:// 或 https:// 图片地址';
  }

  return rawMessage;
};

interface CurrentUser {
  is_admin?: boolean;
}

const getStoredUser = (): CurrentUser | null => {
  try {
    const raw = localStorage.getItem('user');

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
};

const getPermissionDeniedMessage = (isLoggedIn: boolean): string => {
  if (!isLoggedIn) {
    return '请先登录管理员账号后，再进行新增、编辑或删除操作。';
  }

  return '当前账号无权限，只有管理员可以新增、编辑和删除动物信息。';
};

const getManageActionErrorMessage = (error: unknown, isLoggedIn: boolean): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401) {
      return '登录状态已失效，请重新登录管理员账号后再试。';
    }

    if (status === 403) {
      return '当前账号无权限，只有管理员可以新增、编辑和删除动物信息。';
    }
  }

  const rawMessage = getApiErrorMessage(error, isLoggedIn ? '操作失败，请稍后重试。' : '请先登录管理员账号后再试。');
  return buildImageUrlError(rawMessage);
};

const Animals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('keyword') || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canManageAnimals, setCanManageAnimals] = useState(false);
  const [form] = Form.useForm<AnimalFormValues>();

  const selectedCategory = normalize(searchParams.get('category') || 'all');
  const selectedHabitat = normalize(searchParams.get('habitat') || 'all');
  const keywordFromQuery = searchParams.get('keyword')?.trim() || '';

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await api.get<Animal[]>('/api/animals');
      setAnimals(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载动物列表失败'));
    } finally {
      setLoading(false);
    }
  };

  const syncManagePermission = async () => {
    const token = localStorage.getItem('token');
    const storedUser = getStoredUser();

    if (!token) {
      setIsLoggedIn(false);
      setCanManageAnimals(false);
      return;
    }

    setIsLoggedIn(true);
    setCanManageAnimals(Boolean(storedUser?.is_admin));

    try {
      const res = await api.get<CurrentUser>('/api/user');
      const user = res.data || {};
      setCanManageAnimals(Boolean(user.is_admin));
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setCanManageAnimals(false);
      }
    }
  };

  useEffect(() => {
    void fetchAnimals();
    void syncManagePermission();
  }, []);

  useEffect(() => {
    setSearchTerm(keywordFromQuery);
  }, [keywordFromQuery]);

  const filteredAnimals = useMemo(() => {
    const keyword = normalize(searchTerm);

    return animals.filter((animal) => {
      const matchKeyword =
        keyword.length === 0 ||
        normalize(animal.name).includes(keyword) ||
        normalize(animal.species).includes(keyword) ||
        normalize(animal.description).includes(keyword);

      const matchCategory = selectedCategory === 'all' || inferCategory(animal) === selectedCategory;
      const matchHabitat = selectedHabitat === 'all' || inferHabitat(animal) === selectedHabitat;

      return matchKeyword && matchCategory && matchHabitat;
    });
  }, [animals, searchTerm, selectedCategory, selectedHabitat]);

  const openCreateModal = () => {
    if (!canManageAnimals) {
      message.error(getPermissionDeniedMessage(isLoggedIn));
      return;
    }

    setEditingAnimal(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'available',
      category: selectedCategory !== 'all' ? selectedCategory : 'mammal',
      habitat: selectedHabitat !== 'all' ? selectedHabitat : 'savanna',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (animal: Animal) => {
    if (!canManageAnimals) {
      message.error(getPermissionDeniedMessage(isLoggedIn));
      return;
    }

    setEditingAnimal(animal);
    form.setFieldsValue({
      name: animal.name,
      species: animal.species,
      image_url: animal.image_url,
      description: animal.description,
      status: animal.status,
      category: inferCategory(animal),
      habitat: inferHabitat(animal),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingAnimal(null);
    form.resetFields();
  };

  const handleSubmit = async (values: AnimalFormValues) => {
    if (!canManageAnimals) {
      message.error(getPermissionDeniedMessage(isLoggedIn));
      return;
    }

    try {
      setSaving(true);

      if (editingAnimal) {
        await api.put(`/api/animals/${editingAnimal.id}`, values);
        message.success('动物信息已更新');
      } else {
        await api.post('/api/animals', values);
        message.success('动物添加成功');
      }

      closeModal();
      await fetchAnimals();
    } catch (error) {
      message.error(getManageActionErrorMessage(error, isLoggedIn));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!canManageAnimals) {
      message.error(getPermissionDeniedMessage(isLoggedIn));
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/api/animals/${id}`);
      message.success('动物已删除');
      await fetchAnimals();
    } catch (error) {
      message.error(getManageActionErrorMessage(error, isLoggedIn));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-gradient mb-4">动物画廊</h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            全部用户可浏览，管理员可新增、编辑和删除；支持分类与栖息地筛选
          </p>
        </motion.div>

        <div className="glass-effect p-6 rounded-3xl space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                placeholder="按名称、物种或描述搜索..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-emerald-100 focus:outline-none focus:border-emerald-400 bg-white/50 backdrop-blur transition-all text-base"
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            {canManageAnimals ? (
              <Button
                type="primary"
                size="large"
                icon={<Plus size={20} />}
                onClick={openCreateModal}
                className="!h-14 !px-8 !rounded-2xl !text-base font-medium !shadow-lg hover:!shadow-xl !transition-all !bg-gradient-to-r !from-emerald-600 !to-teal-600 !border-none"
              >
                新增动物
              </Button>
            ) : (
              <div className="text-sm text-gray-500 md:text-right">
                {isLoggedIn ? '当前账号仅可浏览动物信息。' : '未登录，仅可浏览动物信息。'}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.filter((option) => option.value !== 'all').map((option) => {
              const active = selectedCategory === option.value;
              return (
                <Tag key={option.value} color={active ? 'green' : 'default'} className="!px-4 !py-1 !rounded-full">
                  {option.label}
                </Tag>
              );
            })}
            {selectedHabitat !== 'all' && (
              <Tag color="blue" className="!px-4 !py-1 !rounded-full">
                当前栖息地筛选: {HABITAT_OPTIONS.find((item) => item.value === selectedHabitat)?.label || selectedHabitat}
              </Tag>
            )}
            {keywordFromQuery.length > 0 && (
              <Tag color="gold" className="!px-4 !py-1 !rounded-full">
                当前关键词: {keywordFromQuery}
              </Tag>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Spin size="large" />
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div className="text-center py-32">
            <Empty description={canManageAnimals ? '暂无匹配动物，请尝试新增或调整筛选条件' : '暂无匹配动物，请调整筛选条件'} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAnimals.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <div className="glass-effect rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={animal.image_url || FALLBACK_IMAGE}
                      alt={animal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(event) => {
                        const target = event.currentTarget;
                        target.onerror = null;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Tag
                        color={animal.status === 'available' ? 'success' : 'warning'}
                        className="!px-3 !py-1 !rounded-full !border-none !font-bold"
                      >
                        {statusLabelMap[animal.status]}
                      </Tag>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">{animal.name}</h3>
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <MapPin size={14} />
                      <span className="text-sm font-medium">{animal.species}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Tag>{CATEGORY_OPTIONS.find((item) => item.value === inferCategory(animal))?.label || '未分类'}</Tag>
                      <Tag color="blue">{HABITAT_OPTIONS.find((item) => item.value === inferHabitat(animal))?.label || '未知栖息地'}</Tag>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                      {animal.description || '暂无描述'}
                    </p>

                    {canManageAnimals && (
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <Button
                          icon={<Pencil size={16} />}
                          onClick={() => openEditModal(animal)}
                          className="!rounded-xl !border-emerald-200 !text-emerald-700"
                        >
                          编辑
                        </Button>
                        <Popconfirm
                          title="确认删除这只动物吗？"
                          okText="确认"
                          cancelText="取消"
                          onConfirm={() => handleDelete(animal.id)}
                        >
                          <Button
                            danger
                            loading={deletingId === animal.id}
                            icon={<Trash2 size={16} />}
                            className="!rounded-xl"
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title={<span className="font-serif text-2xl">{editingAnimal ? '编辑动物' : '新增动物'}</span>}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={620}
        centered
      >
        <Form<AnimalFormValues> form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
          <Form.Item name="name" label={<span className="font-medium">名称</span>} rules={[{ required: true, message: '请输入名称' }]}>
            <Input size="large" placeholder="例如：辛巴" className="!rounded-xl" />
          </Form.Item>

          <Form.Item name="species" label={<span className="font-medium">物种</span>} rules={[{ required: true, message: '请输入物种' }]}>
            <Input size="large" placeholder="例如：非洲狮" className="!rounded-xl" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label={<span className="font-medium">分类</span>}
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select
                size="large"
                options={CATEGORY_OPTIONS.filter((item) => item.value !== 'all')}
                className="!rounded-xl"
              />
            </Form.Item>
            <Form.Item
              name="habitat"
              label={<span className="font-medium">栖息地</span>}
              rules={[{ required: true, message: '请选择栖息地' }]}
            >
              <Select
                size="large"
                options={HABITAT_OPTIONS.filter((item) => item.value !== 'all')}
                className="!rounded-xl"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="status"
              label={<span className="font-medium">状态</span>}
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select
                size="large"
                className="!rounded-xl"
                options={[
                  { label: '可参观', value: 'available' },
                  { label: '已认养', value: 'adopted' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="image_url"
              label={<span className="font-medium">图片链接</span>}
              extra={IMAGE_URL_HINT}
              rules={[
                { required: true, message: '请输入图片链接' },
                {
                  validator: (_, value: string) => {
                    if (!value) {
                      return Promise.resolve();
                    }

                    try {
                      const parsed = new URL(value);

                      if (!['http:', 'https:'].includes(parsed.protocol)) {
                        return Promise.reject(new Error('图片链接必须以 http:// 或 https:// 开头'));
                      }

                      return Promise.resolve();
                    } catch {
                      return Promise.reject(new Error('图片链接格式错误，请输入完整的图片 URL'));
                    }
                  },
                },
              ]}
            >
              <Input size="large" placeholder="https://example.com/animal.jpg" className="!rounded-xl" />
            </Form.Item>
          </div>

          <Form.Item name="description" label={<span className="font-medium">描述</span>}>
            <Input.TextArea rows={4} placeholder="介绍一下这只动物..." className="!rounded-xl" />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={closeModal} size="large" className="!rounded-xl" disabled={saving}>
              取消
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={saving}
              className="!rounded-xl !bg-gradient-to-r !from-emerald-600 !to-teal-600 !border-none"
            >
              {editingAnimal ? '保存修改' : '立即添加'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Animals;
