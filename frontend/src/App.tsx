import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Animals from './pages/Animals';
import Guestbook from './pages/Guestbook';
import Login from './pages/Login';
import Register from './pages/Register';
import Tour from './pages/Tour';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#16a34a',
          colorBgBase: '#fafaf9',
          borderRadius: 12,
          fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
          fontSize: 15,
        },
        components: {
          Button: {
            borderRadius: 12,
            controlHeight: 44,
            fontWeight: 500,
          },
          Input: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Card: {
            borderRadiusLG: 20,
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="animals" element={<Animals />} />
              <Route path="tour" element={<Tour />} />
              <Route path="guestbook" element={<Guestbook />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
