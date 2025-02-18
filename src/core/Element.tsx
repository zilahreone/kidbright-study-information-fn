import Layout, { Content, Footer, Header } from "antd/es/layout/layout";
import Navbar from "./Navbar";
import { Col, Row } from "antd";
import FooterComponent from "./Footer";

export default function ElementComponent({ hasHeader = true, hasFooter = true, children }: { hasHeader?: boolean, hasFooter?: boolean, children: JSX.Element }) {

  const headerStyle: React.CSSProperties = {
    padding: '0px 50px',
    // textAlign: 'center',
    color: '#fff',
    height: 64,
    // paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
  };

  const contentStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - (64px + 200px + 20px))', // Assuming footer height is 64px
    // padding: `0px 100px 0px`,
    // borderColor: 'red'
    // textAlign: 'center',
    // minHeight: 'calc(100%)',
    // lineHeight: '120px',
    // color: '#fff',
    // backgroundColor: '#0958d9',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '20px',
    height: '200px',
    // textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
  };

  const layoutStyle = {
    borderRadius: 0,
    overflow: 'hidden',
    // backgroundColor: 'yellow',
    // width: 'calc(50% - 8px)',
    // minWidth: '500px',
  };

  return (
    <Layout style={layoutStyle}>
      {
        hasHeader && (
          <Header style={headerStyle}>
            <Navbar />
          </Header>
        )
      }
      <Content style={contentStyle}>
        <Row justify={'center'}>
          <Col span={22} xs={{ span: 20 }} md={{ span: 18 }} lg={{ span: 16 }} >
            {children}
          </Col>
        </Row>
      </Content>
      {
        hasFooter && (
          <Footer style={footerStyle}>
            <FooterComponent />
          </Footer>
        )
      }
    </Layout>
  )
}
