import React from 'react';
import { Avatar, Layout, Menu, theme } from 'antd';
import { CalculatorOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Conversion from './components/Conversion/index.tsx';

const { Header, Content, Sider } = Layout;

const items: MenuProps['items'] = [{
  key: 'Tools',
  icon: <CalculatorOutlined />,
  label: 'Tools',
}, {
  key: 'Demo',
  icon: <LineChartOutlined />,
  label: 'Demo',
  children: new Array(2).fill(null).map((_, j) => ({
      key: `Demo Option${j}`,
      label: `Demo Option${j}`,
  })),
}];

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
          <img src={require('./asset/logo.jpg')} width="100px" id="logo" alt=""/>
          <Avatar style={{ backgroundColor: '#f56a00', float: 'right' }}>S</Avatar>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['Tools']}
            // defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          />
        </Sider>
        <Layout style={{ padding: '24px 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Conversion />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
