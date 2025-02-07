import { useKeycloak } from "@react-keycloak/web";
import { Button, DatePicker, Flex, Form, Input, Layout, Select } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function CourseLanding() {

  type General = {
    id: string | undefined;
    name: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    birthdate?: string | undefined;
  }

  type Study = {
    id?: string;
    userId: string | undefined;
    subjectId: string | undefined;
    subjectName: string | undefined;
    school: string | undefined;
    grade: string | undefined;
    level?: number;
    classRoom?: number;
  }

  // const grades = ['ประถมศึกษา', 'มัธยมศึกษา', 'ปวช.', 'ปวส.', 'ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก'];
  const grades = {
    primary: 'ประถมศึกษา',
    secondary: 'มัธยมศึกษา',
    vocational: 'ปวช.',
    associate: 'ปวส.',
    bachelor: 'ปริญญาตรี',
    master: 'ปริญญาโท',
    doctoral: 'ปริญญาเอก'
  };

  const { Option } = Select;
  const [searchParams] = useSearchParams();
  const { keycloak } = useKeycloak();
  const [generalDisabledForm, setGeneralDisabledForm] = useState<boolean>(false);
  const [studyDisabledForm, setStudylDisabledForm] = useState<boolean>(false);

  const [formGeneral] = Form.useForm();
  const [formStudy] = Form.useForm();

  const [general, setGeneral] = useState<General>({
    id: undefined,
    name: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    birthdate: undefined
  });

  const [study, setStudy] = useState<Study>({
    userId: undefined,
    subjectId: undefined,
    subjectName: undefined,
    school: undefined,
    grade: undefined,
    level: undefined,
    classRoom: undefined
  });

  const fetchAPI = async (method: 'GET' | 'POST' | 'DELETE' | 'PATCH', endpoint: string, token?: string, body?: Object): Promise<any> => {
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(['POST', 'PATCH'].includes(method) && { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      throw new Response(response.statusText, { status: response.status });
    }
    return await response.json();
  }

  // const fetchStudy = async (sub: string): Promise<void> => {
  //   const id = await fetchAPI('GET', `https://kidbright-study-bn.ae.app.meca.in.th/studies/${sub}`, keycloak.token);
  //   console.log(id);
  // }

  useEffect(() => {
    const fetchUser = async () => {
      const fetchUser: General = await fetchAPI('GET', `https://kidbright-study-bn.ae.app.meca.in.th/api/kidbright/users/${keycloak.tokenParsed?.sub}`, keycloak.token).catch(async (error) => {
        if (error instanceof Response && error.status === 404) {
          formGeneral.setFieldsValue({ firstname: keycloak.tokenParsed?.['given_name'], lastname: keycloak.tokenParsed?.['family_name'] });
          setGeneral({
            ...general,
            id: keycloak.tokenParsed?.['sub'],
            name: keycloak.tokenParsed?.['name'],
            firstName: keycloak.tokenParsed?.['given_name'],
            lastName: keycloak.tokenParsed?.['family_name'],
            email: keycloak.tokenParsed?.['email'],
          });
        }
      });
      // delete user.birthdate
      formGeneral.setFieldsValue({ firstname: fetchUser.firstName, lastname: fetchUser.lastName, birthdate: dayjs(fetchUser.birthdate || '') });
      setGeneral(fetchUser);
      // console.log(fetchUser);
      setGeneralDisabledForm(true);
    }
    const fetchData = async () => {
      const f = await fetchAPI('GET', `https://sbs-backend.mooc.meca.in.th/lms/${searchParams.get('usageId')}`).catch((error) => {
        // alert('ไม่สามารถดึงข้อมูลวิชาได้');
        console.error('"usageId" ไม่สามารถเรียกขอมูลวิชาได้', error);
      });
      if (f) {
        formStudy.setFieldsValue({ subjectId: f['courseKey'], subjectName: f['courseTitle'] });
        setStudy({
          ...study,
          userId: keycloak.tokenParsed?.sub,
          subjectId: f['courseKey'],
          subjectName: f['courseTitle'],
        })
      }
      const fetchStudy = await fetchAPI('GET', `https://kidbright-study-bn.ae.app.meca.in.th/api/kidbright/studies/${keycloak.tokenParsed?.sub}`, keycloak.token).catch(async (error) => {
        // alert('ไม่สามารถดึงข้อมูลการเรียนได้');
        console.error('ไม่สามารถดึงข้อมูลการเรียนได้', error);
      });
      // console.log(fetchStudy);
      formStudy.setFieldsValue({ school: fetchStudy.school, grade: fetchStudy.grade, level: fetchStudy.level, classRoom: fetchStudy.classRoom });
      setStudy({ userId: keycloak.tokenParsed?.sub || null, ...fetchStudy });
      setStudylDisabledForm(true);
    };
    fetchUser();
    fetchData();
    // fetchStudy(keycloak.tokenParsed?.sub || '');
    // console.log(keycloak);
    // keycloak.logout()
    // console.log(
    //   searchParams.get('usageId')
    // );

  }, [])

  const handleGeneralSubmit = (value: General): void => {
    // console.log(value);
    // const date = new Date(value.birthday || '');
    // console.log(date.toISOString());
    // console.log(
    //   new Date(date).toLocaleDateString()
    // );

    fetchAPI('POST', 'http://localhost:3000/api/kidbright/users', keycloak.token, {
      ...general,
      birthdate: new Date(value.birthdate || '').toISOString()
    }).then(() => {
      // console.log(res);
      alert('บันทึกข้อมูลเรียบร้อย');
      setGeneralDisabledForm(true);
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleEditGeneralForm = (): void => {
    setGeneralDisabledForm(false);
  }

  const handleStudySubmit = (): void => {
    // console.log(study);
    if (study.id) {
      fetchAPI('PATCH', `http://localhost:3000/api/kidbright/studies/${study.id}`, keycloak.token, study).then(() => {
        alert('บันทึกข้อมูลเรียบร้อย');
        setStudylDisabledForm(true);
      }).catch((error) => {
        console.error(error);
      });
    } else {
      fetchAPI('POST', 'http://localhost:3000/api/kidbright/studies', keycloak.token, study).then(() => {
        alert('บันทึกข้อมูลเรียบร้อย');
        setStudylDisabledForm(true);
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  const handleEditStudyForm = (): void => {
    setStudylDisabledForm(false);
  }

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
                onFinish={handleGeneralSubmit}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="ชื่อ"
                  name="firstname"
                  rules={[{ required: true, message: 'กรุณาระบุ ชื่อ' }]}
                >
                  <Input
                    disabled={generalDisabledForm}
                    onInput={(e) => setGeneral({ ...general, firstName: e.currentTarget.value })}
                  />
                </Form.Item>

                <Form.Item
                  label="นามสกุล"
                  name="lastname"
                  rules={[{ required: true, message: 'กรุณาระบุ นามสกุล' }]}
                >
                  <Input
                    disabled={generalDisabledForm}
                    onInput={(e) => setGeneral({ ...general, lastName: e.currentTarget.value })}
                  />
                </Form.Item>
                <Form.Item
                  label="วันเกิด"
                  name="birthdate"
                  rules={[{ required: true, message: 'กรุณาระบุ วัน เดือน ปีเกิด' }]}
                >
                  <DatePicker
                    format={'DD-MM-YYYY'}
                    // defaultValue={dayjs('2019-09-03', 'YYYY-MM-DD')}
                    minDate={dayjs('1970-01-01')}
                    // maxDate={dayjs(new Date(), 'YYYY-MM-DD')}
                    disabled={generalDisabledForm}
                    style={{ width: '100%' }}
                    onChange={(_, dateString) => setGeneral({ ...general, birthdate: Array.isArray(dateString) ? dateString[0] : dateString })}
                  />
                </Form.Item>

                <Form.Item label={null}>
                  <Flex gap="small">
                    <Button disabled={generalDisabledForm} type="primary" htmlType="submit">
                      บันทึก
                    </Button>
                    <Button onClick={handleEditGeneralForm} color="danger" variant="solid">
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
                onFinish={handleStudySubmit}
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
                  <Input
                    disabled={studyDisabledForm}
                    onInput={(e) => setStudy({ ...study, school: e.currentTarget.value })}
                  />
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
                      disabled={studyDisabledForm}
                      placeholder=""
                      onChange={(e) => {
                        setStudy({
                          ...study,
                          grade: e,
                          ...(!['primary', 'secondary'].includes(e) && { level: undefined, classRoom: undefined })
                        }),
                        !['primary', 'secondary'].includes(e) && formStudy.setFieldsValue({ level: undefined, classRoom: undefined }),
                        formStudy.validateFields(['level', 'classRoom']);
                      }

                      }
                      allowClear
                    >
                      {
                        Object.entries(grades).map(([key, value], _) => (
                          <Option key={key} value={key}>{value}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="level"
                    rules={[{ required: ['primary', 'secondary'].includes(study.grade || ''), message: 'กรุณาระบุ ชั้น' }]}
                    style={{ display: 'inline-block', width: 'calc(34% - 8px)', margin: '0 8px' }}
                  >
                    <Select
                      disabled={studyDisabledForm || !['primary', 'secondary'].includes(study.grade || '')}
                      placeholder="ชั้น"
                      onChange={(e) => setStudy({ ...study, level: (e) })}
                      allowClear
                    >
                      {
                        Array.from({ length: 6 }, (_, i) => i + 1).map((value, index) => (
                          <Option key={`${index}`} value={value.toString()}>{value}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="classRoom"
                    rules={[
                      // { required: ['primary', 'secondary'].includes(study.grade || ''), message: 'กรุณาระบุ ห้อง' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!['primary', 'secondary'].includes(getFieldValue('grade')) || value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('กรุณาระบุ ห้อง'));
                        },
                      })
                    ]}
                    style={{ display: 'inline-block', width: 'calc(33% - 0px)', margin: '0 0px' }}
                  >
                    <Input
                      disabled={studyDisabledForm || !['primary', 'secondary'].includes(study.grade || '')}
                      allowClear
                      onChange={(e) => parseInt(e.target.value) > 0 && setStudy({ ...study, classRoom: parseInt(e.target.value) })}
                      placeholder='ห้อง'
                      type='number' max={6} min={1} />
                  </Form.Item>

                </Form.Item>

                <Form.Item label={null}>
                  <Flex gap="small">
                    <Button disabled={studyDisabledForm} type="primary" htmlType="submit">
                      บันทึก
                    </Button>
                    <Button onClick={handleEditStudyForm} color="danger" variant="solid">
                      แก้ไข
                    </Button>
                  </Flex>
                </Form.Item>
              </Form>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => keycloak.logout()} color="orange" variant="solid">
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Kidbright ©{new Date().getFullYear()} Created by NECTEC
        </Footer>
      </Layout>
    </>
  )
}
