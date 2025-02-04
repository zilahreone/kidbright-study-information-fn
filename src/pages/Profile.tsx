import { useKeycloak } from "@react-keycloak/web";
import { Button, DatePicker, Flex, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Profile() {

  type Profile = {
    id: string | undefined;
    name: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    birthdate?: string | undefined;
  }

  const { keycloak } = useKeycloak();
  const [formProfile] = Form.useForm();
  const [profileDisabledForm, setProfileDisabledForm] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    id: undefined,
    name: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    birthdate: undefined
  });

  const fetchAPI = async (method: 'GET' | 'POST' | 'DELETE' | 'PATCH', endpoint: string, token: string | null = null, body: Object = {}): Promise<any> => {
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(['PUT', 'POST', 'PATCH'].includes(method) && { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      throw new Response(response.statusText, { status: response.status });
    }
    return await response.json();
  }

  const handleProfileSubmit = (value: Profile): void => {

    fetchAPI('POST', 'http://localhost:3000/api/kidbright/users', keycloak.token, {
      ...profile,
      birthdate: new Date(value.birthdate || '').toISOString()
    }).then(() => {
      // console.log(res);
      alert('บันทึกข้อมูลเรียบร้อย');
      setProfileDisabledForm(true);
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    const fetchUser = async () => {
      const fetchUser: Profile = await fetchAPI('GET', `https://kidbright-study-bn.ae.app.meca.in.th/api/kidbright/users/${keycloak.tokenParsed?.sub}`, keycloak.token).catch(async (error) => {
        if (error instanceof Response && error.status === 404) {
          formProfile.setFieldsValue({ firstname: keycloak.tokenParsed?.['given_name'], lastname: keycloak.tokenParsed?.['family_name'] });
          setProfile({
            ...profile,
            id: keycloak.tokenParsed?.['sub'],
            name: keycloak.tokenParsed?.['name'],
            firstName: keycloak.tokenParsed?.['given_name'],
            lastName: keycloak.tokenParsed?.['family_name'],
            email: keycloak.tokenParsed?.['email'],
          });
        }
      });
      // delete user.birthdate
      formProfile.setFieldsValue({ firstname: fetchUser.firstName, lastname: fetchUser.lastName, birthdate: dayjs(fetchUser.birthdate || '') });
      setProfile(fetchUser);
      // console.log(fetchUser);
      setProfileDisabledForm(true);
    }
    fetchUser();
    // return () => {
    //   second
    // }
  }, [])


  return (
    <div>
      <Title level={3}>ข้อมูลทั่วไป</Title>
      <Form
        name="general-information"
        form={formProfile}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        initialValues={{ remember: true }}
        onFinish={handleProfileSubmit}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="ชื่อ"
          name="firstname"
          rules={[{ required: true, message: 'กรุณาระบุ ชื่อ' }]}
        >
          <Input
            disabled={profileDisabledForm}
            onInput={(e) => setProfile({ ...profile, firstName: e.currentTarget.value })}
          />
        </Form.Item>

        <Form.Item
          label="นามสกุล"
          name="lastname"
          rules={[{ required: true, message: 'กรุณาระบุ นามสกุล' }]}
        >
          <Input
            disabled={profileDisabledForm}
            onInput={(e) => setProfile({ ...profile, lastName: e.currentTarget.value })}
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
            disabled={profileDisabledForm}
            style={{ width: '100%' }}
            onChange={(_, dateString) => setProfile({ ...profile, birthdate: Array.isArray(dateString) ? dateString[0] : dateString })}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Flex gap="small">
            <Button disabled={profileDisabledForm} type="primary" htmlType="submit">
              บันทึก
            </Button>
            <Button onClick={() => setProfileDisabledForm(false)} color="danger" variant="solid">
              แก้ไข
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  )
}
