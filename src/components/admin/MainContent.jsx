import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import HeaderAdmin from "./Header";
import FooterAdmin from "./Footer";
import SideNav from "./SideNav";

const { Header: AntHeader, Content, Sider } = Layout;

const MainContent = () => {
    const [visible, setVisible] = useState(false);
    const [sidenavColor, setSideNavColor] = useState("#1890ff");

    const openDrawer = () => setVisible(!visible);
   
    const handleSidenavColor = (color) => setSideNavColor(color);
    const handleFixedNavbar = (type) => setFixed(type);

    let { pathname } = useLocation();
    pathname = pathname.replace("/", "");
return (
   <Layout
      className={`layout-dashboard ${
        pathname === "profile" ? "layout-profile" : ""
      } `}
    >
      <Drawer
        title={false}
        placement={"right"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={"right"}
        width={250}
        className={`drawer-sidebar`}
      >
        <Layout
          className={`layout-dashboard`}
        >
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary `}
            style={{ background: "transparent" }}
          >
            <SideNav color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary`}
        style={{ background: "transparent" }}
      >
        <SideNav color={sidenavColor} />
      </Sider>
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <HeaderAdmin
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <HeaderAdmin
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}
        <Content className="content-ant">{children}</Content>
        <FooterAdmin />
      </Layout>
    </Layout>
  )
}

export default MainContent