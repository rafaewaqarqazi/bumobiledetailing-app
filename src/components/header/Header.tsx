import React from "react";
import { Button, Layout, Space, theme } from "antd";
import { useDispatch } from "react-redux";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useSidebarContext } from "@/context/SidebarContext";
import { authActions } from "@/lib/features/authSlice";
import { signOut } from "next-auth/react";

const Header = () => {
  const dispatch = useDispatch();
  const { isOn, toggle } = useSidebarContext();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleLogout = () => {
    signOut().then(() => {
      dispatch(authActions.logout());
    });
  };
  return (
    <Layout.Header style={{ padding: 0, background: colorBgContainer }}>
      <div className="flex items-center justify-between pr-4 h-full">
        {React.createElement(isOn ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: "text-lg",
          onClick: toggle,
        })}
        <Space size={"middle"}>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </div>
    </Layout.Header>
  );
};

export default Header;
