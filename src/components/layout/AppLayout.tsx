import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  MenuOutlined,
  LogoutOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { supabase } from "../../lib/supabase";

const { Sider, Content } = Layout;

const navItems = [
  { key: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "/analytics", icon: <BarChartOutlined />, label: "Analytics" },
  { key: "/billing", icon: <DollarOutlined />, label: "Billing" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <Link to={item.key}>{item.label}</Link>,
  }));

  const logoutItem = {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
    danger: true,
    onClick: handleLogout,
  };

  const SideMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={[...menuItems, logoutItem]}
      style={{ flex: 1, border: "none" }}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Desktop sidebar */}
      <Sider
        className="sider"
        width={220}
        style={{ display: "flex", flexDirection: "column" }}
        breakpoint="md"
        collapsedWidth={0}
        trigger={null}
      >
        <Link
          to="/"
          style={{
            display: "block",
            padding: "20px 24px",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          EdgeForge
        </Link>
        {SideMenu}
      </Sider>

      <Layout>
        {/* Mobile header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            background: "var(--bg-nav)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
          className="mobile-header"
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            style={{ color: "var(--text-primary)" }}
          />
          <Link
            to="/"
            style={{
              fontWeight: 700,
              color: "var(--text-primary)",
              marginLeft: 12,
              textDecoration: "none",
            }}
          >
            EdgeForge
          </Link>
        </div>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          width={220}
          styles={{ body: { padding: 0, background: "var(--bg-nav)" } }}
        >
          {SideMenu}
        </Drawer>

        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
