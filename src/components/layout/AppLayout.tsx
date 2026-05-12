import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Button, Drawer } from "antd";
import {
  BarChartOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { apiFetch } from "../../lib/api";
import { API_ROUTES } from "../../lib/routes";
import type { MeResponse } from "../../types/users";

const { Sider, Content } = Layout;

const navItems = [
  { key: "/analytics", icon: <BarChartOutlined />, label: "Analytics" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: me } = useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: () => apiFetch(API_ROUTES.me),
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <Link to={item.key}>{item.label}</Link>,
  }));

  const avatarDropdownItems = [
    { key: "/profile", label: <Link to="/profile">Profile</Link> },
    { key: "/settings", label: <Link to="/settings">Settings</Link> },
    { type: "divider" as const },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const AvatarBlock = (
    <Dropdown
      menu={{ items: avatarDropdownItems }}
      trigger={["click"]}
      placement="topLeft"
    >
      <div
        style={{
          padding: "12px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <Avatar
          size={34}
          src={me?.avatar_url ?? undefined}
          icon={<UserOutlined />}
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        />
        {me?.display_name && (
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: 13,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {me.display_name}
          </span>
        )}
      </div>
    </Dropdown>
  );

  const SideMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
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
        {AvatarBlock}
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
          styles={{ body: { padding: 0, background: "var(--bg-nav)", display: "flex", flexDirection: "column" } }}
        >
          {SideMenu}
          {AvatarBlock}
        </Drawer>

        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
