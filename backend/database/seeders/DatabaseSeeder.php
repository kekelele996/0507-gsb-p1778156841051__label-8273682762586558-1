<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Animal;
use App\Models\Message;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 保证测试账号始终可用：admin@example.com / password
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => '管理员',
                'password' => Hash::make('password'),
                'is_admin' => true,
            ]
        );

        // 图片均改为 Pexels 搜索结果中的直链，且使用 updateOrCreate 避免重复插入
        Animal::updateOrCreate(
            ['name' => '辛巴', 'species' => '非洲狮'],
            [
                'description' => '保护区中的王者，精力充沛，喜欢在草原散步。',
                'image_url' => 'https://images.pexels.com/photos/34410507/pexels-photo-34410507.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900',
                'status' => 'available',
                'category' => 'mammal',
                'habitat' => 'savanna',
            ]
        );

        Animal::updateOrCreate(
            ['name' => '多多', 'species' => '非洲象'],
            [
                'description' => '温柔的巨人，最喜欢洗澡和吃水果。',
                'image_url' => 'https://images.pexels.com/photos/35365866/pexels-photo-35365866.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900',
                'status' => 'available',
                'category' => 'mammal',
                'habitat' => 'savanna',
            ]
        );

        Animal::updateOrCreate(
            ['name' => '马蒂', 'species' => '平原斑马'],
            [
                'description' => '奔跑速度快，活动范围大，是游客最喜欢的明星之一。',
                'image_url' => 'https://images.pexels.com/photos/35725717/pexels-photo-35725717.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900',
                'status' => 'adopted',
                'category' => 'mammal',
                'habitat' => 'savanna',
            ]
        );

        Animal::updateOrCreate(
            ['name' => '火烈鸟', 'species' => '美洲红鹳'],
            [
                'description' => '栖息在浅水湿地，群居活动，羽色鲜明。',
                'image_url' => 'https://images.pexels.com/photos/35729059/pexels-photo-35729059.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900',
                'status' => 'available',
                'category' => 'bird',
                'habitat' => 'wetland',
            ]
        );

        Animal::updateOrCreate(
            ['name' => '绿宝', 'species' => '绿鬣蜥'],
            [
                'description' => '喜欢高温潮湿环境，常在枝头晒太阳。',
                'image_url' => 'https://images.pexels.com/photos/35679593/pexels-photo-35679593.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900',
                'status' => 'available',
                'category' => 'reptile',
                'habitat' => 'rainforest',
            ]
        );

        Animal::updateOrCreate(
            ['name' => '阿布', 'species' => '黑帽悬猴'],
            [
                'description' => '机敏好动，擅长在树冠层快速移动。',
                'image_url' => 'https://images.pexels.com/photos/35759209/pexels-photo-35759209.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900',
                'status' => 'available',
                'category' => 'mammal',
                'habitat' => 'rainforest',
            ]
        );

        Animal::updateOrCreate(
            ['name' => '蓝海', 'species' => '宽吻海豚'],
            [
                'description' => '智慧且友好，常在近海区域群体活动。',
                'image_url' => 'https://images.pexels.com/photos/35659857/pexels-photo-35659857.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900',
                'status' => 'available',
                'category' => 'aquatic',
                'habitat' => 'ocean',
            ]
        );

        Message::firstOrCreate([
            'nickname' => '自然爱好者',
            'content' => '场馆设计很棒，狮子展区特别震撼！',
        ]);

        Message::firstOrCreate([
            'nickname' => '护林志愿者',
            'content' => '希望继续增加北极主题内容，期待下一次更新。',
        ]);
    }
}
