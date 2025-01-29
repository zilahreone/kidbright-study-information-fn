// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Layout, { Content, Footer, Header } from 'antd/es/layout/layout'
import { Breadcrumb, Button, DatePicker, Flex, Form, Input, Menu, Select } from 'antd'
const { Option } = Select;
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';

function App() {
  // const [count, setCount] = useState(0)
  type General = {
    firstname: string | null;
    lastname: string | null;
    birthday: string | null;
  }
  type Study = {
    subjectId: string | null;
    subjectName: string | null
    school: string | null;
    grade: string | null;
    level: number | null;
    classRoom: number | null;
  }

  const [general, setGeneral] = useState<General>({
    firstname: null,
    lastname: null,
    birthday: null
  });

  const [study, setStudy] = useState<Study>({
    subjectId: null,
    subjectName: null,
    school: null,
    grade: null,
    level: null,
    classRoom: null
  });

  const grades = ['ประถมศึกษา', 'มัธยมศึกษา', 'ปวช.', 'ปวส.', 'ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก'];

  const [formGeneral] = Form.useForm();
  const [formStudy] = Form.useForm();

  // const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  //   console.log('Success:', values);
  // };

  // const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };


  const fetchAPI = async (method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH', endpoint: string, token: string | null = null): Promise<any> => {
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const f = await fetchAPI('GET', 'https://sbs-backend.mooc.meca.in.th/lms/block-v1:NECTEC+KM-001+NECTEC_000005+type@vertical+block@434d910a93604d30900112afd747ee06')
        formStudy.setFieldsValue({ subjectId: f['courseKey'], subjectName: f['courseTitle'] });
        // setData(f);
        setStudy({
          ...study,
          subjectId: f['courseKey'],
          subjectName: f['courseTitle'],
        })
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [])

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        {/* <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
      </Header> */}
        <Content style={{ padding: '0 48px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
          <div
          // style={{
          //   background: colorBgContainer,
          //   minHeight: 280,
          //   padding: 24,
          //   borderRadius: borderRadiusLG,
          // }}
          >
            {/* <pre>{JSON.stringify(general, null, 2)}</pre>
            <pre>{JSON.stringify(study, null, 2)}</pre> */}
            <div>
              <Title level={3}>ข้อมูลทั่วไป</Title>
              <Form
                name="general-information"
                form={formGeneral}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="ชื่อ"
                  name="firstname"
                  rules={[{ required: true, message: 'กรุณาระบุ ชื่อ' }]}
                >
                  <Input
                    onInput={(e) => setGeneral({ ...general, firstname: e.currentTarget.value })}
                  />
                </Form.Item>

                <Form.Item
                  label="นามสกุล"
                  name="lastname"
                  rules={[{ required: true, message: 'กรุณาระบุ นามสกุล' }]}
                >
                  <Input
                    onInput={(e) => setGeneral({ ...general, lastname: e.currentTarget.value })}
                  />
                </Form.Item>
                <Form.Item
                  label="วันเกิด"
                  name="birthday"
                  rules={[{ required: true, message: 'กรุณาระบุ วัน เดือน ปีเกิด' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={(_, dateString) => setGeneral({ ...general, birthday: Array.isArray(dateString) ? dateString[0] : dateString })}
                  />
                </Form.Item>

                <Form.Item label={null}>
                  <Flex gap="small">
                    <Button type="primary" htmlType="submit">
                      บันทึก
                    </Button>
                    <Button color="danger" variant="solid">
                      แก้ไข
                    </Button>
                  </Flex>
                </Form.Item>
              </Form>
            </div>
            <div>
              <Title level={3}>ข้อมูลการเรียน</Title>
              <Form
                name="study-information"
                form={formStudy}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="รหัสวิชา"
                  name="subjectId"
                  rules={[{ required: true, message: 'กรุณาระบุ รหัสวิชา' }]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="ชื่อวิชา"
                  name="subjectName"
                  rules={[{ required: true, message: 'กรุณาระบุ ชื่อวิชา' }]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="โรงเรียน"
                  name="school"
                  rules={[{ required: true, message: 'กรุณาระบุ โรงเรียน' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="ระดับชั้น"
                  style={{ marginBottom: 16 }}
                  required={true}
                >
                  <Form.Item
                    name="grade"
                    rules={[{ required: true, message: 'กรุณาระบุ ระดับชั้น' }]}
                    style={{ display: 'inline-block', width: 'calc(33% - 8px)', margin: '0 0px' }}
                  >
                    <Select
                      placeholder=""
                      onChange={(e) => setStudy({ ...study, grade: e })}
                      allowClear
                    >
                      {
                        grades.map((value, index) => (
                          <Option key={index} value={value}>{value}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="level"
                    rules={[{ required: true, message: 'กรุณาระบุ ชั้น' }]}
                    style={{ display: 'inline-block', width: 'calc(34% - 8px)', margin: '0 8px' }}
                  >
                    <Select
                      placeholder="ชั้น"
                      onChange={(e) => setStudy({ ...study, level: (e) })}
                      allowClear
                    >
                      {
                        Array.from({ length: 6 }, (_, i) => i + 1).map((value, index) => (
                          <Option key={index} value={value}>{value}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="classRoom"
                    rules={[{ required: true, message: 'กรุณาระบุ ห้อง' }]}
                    style={{ display: 'inline-block', width: 'calc(33% - 0px)', margin: '0 0px' }}
                  >
                    <Input
                      allowClear
                      onChange={(e) => parseInt(e.target.value) > 0 && setStudy({ ...study, classRoom: parseInt(e.target.value) })}
                      placeholder='ห้อง'
                      type='number' max={6} min={1} />
                  </Form.Item>

                </Form.Item>

                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit">
                    บันทึก
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </>
  )
}

export default App
