import { useKeycloak } from "@react-keycloak/web";
import { Button, ColProps, DatePicker, Flex, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { fetchAPI } from "../utils";

export default function ProfileData({
  titleLevel = 3,
  formLabelCol = { span: 4 },
  style = { maxWidth: 600 }
}: {
  titleLevel?: 1 | 2 | 3 | 4 | 5,
  formLabelCol?: ColProps,
  style?: React.CSSProperties
}) {
  type Profile = {
    userId?: string;
    userName?: string;
    preferredUsername?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    birthdate?: string;
  }

  const { keycloak } = useKeycloak();
  const [formProfile] = Form.useForm();
  const [profileDisabledForm, setProfileDisabledForm] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>()
  // const [profile, setProfile] = useState<Profile>({
  //   id: undefined,
  //   name: undefined,
  //   firstName: undefined,
  //   lastName: undefined,
  //   email: undefined,
  //   birthdate: undefined
  // });


  const handleProfileSubmit = (): void => {
    fetchAPI('POST', `${process.env.BASEURL}/api/kidbright/user`, keycloak.token, {
      ...profile,
      birthdate: profile?.birthdate
    }).then(() => {
      // console.log(res);
      alert('บันทึกข้อมูลเรียบร้อย');
      setProfileDisabledForm(true);
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    // console.log(keycloak.tokenParsed);
    const fetchUser = async () => {
      const fetchUser: Profile = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/user/${keycloak.tokenParsed?.sub}`, keycloak.token).catch(async (error) => {
        if (error instanceof Response && error.status === 404) {
          formProfile.setFieldsValue({ firstname: keycloak.tokenParsed?.['given_name'], lastname: keycloak.tokenParsed?.['family_name'] });
          setProfile({
            ...profile,
            userId: keycloak.tokenParsed?.['sub'],
            userName: keycloak.tokenParsed?.['name'],
            preferredUsername: keycloak.tokenParsed?.['preferred_username'],
            firstName: keycloak.tokenParsed?.['given_name'],
            lastName: keycloak.tokenParsed?.['family_name'],
            email: keycloak.tokenParsed?.['email'],
          });
        }
      });
      if (fetchUser) {
        formProfile.setFieldsValue({ firstname: fetchUser.firstName, lastname: fetchUser.lastName, birthdate: dayjs(fetchUser.birthdate || '') });
        setProfile(fetchUser);
        setProfileDisabledForm(true);
      }
      // delete user.birthdate
      // console.log(fetchUser);
    }
    fetchUser();
    // return () => {
    //   second
    // }
  }, [])
  return (
    <>
      <Title level={titleLevel}>ข้อมูลทั่วไป</Title>
      <Form
        name="general-information"
        form={formProfile}
        labelCol={formLabelCol}
        // wrapperCol={{ span: 16 }}
        style={style}
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
            format={'YYYY-MM-DD'}
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
    </>
  )
}