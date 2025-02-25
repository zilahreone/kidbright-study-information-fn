import Title from "antd/es/typography/Title";
import { AutoComplete, Button, Flex, Form, Input } from "antd";
// import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { fetchAPI } from "../utils";
import { useKeycloak } from "@react-keycloak/web";

type Profile = {
  userId?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: string;
  instituteId?: string;
  institute?: string;
  grade?: string;
  level?: string,
  classRoom?: string;
};

enum FormProfileName {
  name = 'profile',
  firstname = 'firstName',
  lastname = 'lastName',
  birthdate = 'birthdate',
  institute = 'institute',
};

type Institute = {
  province: string
  district: string
  department: string
  instituteName: string
  instituteId: string
};

export default function Profile() {
  const { keycloak } = useKeycloak();
  const [formProfile] = Form.useForm();
  const [profileDisabledForm, setProfileDisabledForm] = useState<boolean>(false)
  const [profile, setProfile] = useState<Profile>()
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [institutes, setInstitutes] = useState<Institute[]>()

  const handleProfileSubmit = (): void => {
    fetchAPI('POST', `${process.env.BASEURL}/api/kidbright/user`, keycloak.token, profile).catch((error) => {
      console.error(error);
    });
    fetchAPI('POST', `${process.env.BASEURL}/api/kidbright/teacher`, keycloak.token, { teacherId: profile?.userId, instituteId: profile?.instituteId }).then((res) => {
    // fetchAPI('PATCH', `${process.env.BASEURL}/api/kidbright/teacher/${profile?.userId}`, keycloak.token, { instituteId: profile?.instituteId }).then((res) => {
      console.log(res);
      alert('บันทึกข้อมูลเรียบร้อย');
    })
    setProfileDisabledForm(true);
  }

  useEffect(() => {
    const fetchUser = async () => {
      let profileFetch: Profile = {
        userId: '',
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        birthdate: ''
      };
      await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/teacher/${keycloak.tokenParsed?.sub}`, keycloak.token).then(({ user, institute }: { user: Profile, institute: Institute }) => {
        formProfile.setFieldsValue({ [FormProfileName.firstname]: user.firstName, [FormProfileName.lastname]: user.lastName, [FormProfileName.institute]: `${institute.instituteName} (${institute.district}, ${institute.province})` });
        profileFetch = {...user, ...institute};
        setProfileDisabledForm(true);
      }).catch(async (error) => {
        if (error instanceof Response && error.status === 404) {
          formProfile.setFieldsValue({ [FormProfileName.firstname]: keycloak.tokenParsed?.['given_name'], [FormProfileName.lastname]: keycloak.tokenParsed?.['family_name'] });
          profileFetch.userId = keycloak.tokenParsed?.['sub'] || '',
            profileFetch.userName = keycloak.tokenParsed?.['name'],
            profileFetch.firstName = keycloak.tokenParsed?.['given_name'],
            profileFetch.lastName = keycloak.tokenParsed?.['family_name'],
            profileFetch.email = keycloak.tokenParsed?.['email']
        }
      });
      setProfile({ ...profile, ...profileFetch });
    }
    fetchUser();
  }, [])

  const handleSetInstitute = async (value: string) => {
    clearTimeout(timer)
    const newTimer = setTimeout(async () => {
      await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/institute?instituteName=${value}`, keycloak.token).then((res: Institute[]) => {
        if (res.length > 0) setInstitutes(res.map(institute => ({ ...institute, value: institute.instituteId, label: `${institute.instituteName} (${institute.district}, ${institute.province})` })))
      })
    }, 1500)
    setTimer(newTimer)
    const institute = institutes?.filter(ins => ins.instituteId === value)[0];
    if (institute) {
      setProfile({ ...profile, institute: institute.instituteName, instituteId: institute.instituteId })
      formProfile.setFieldsValue({ [FormProfileName.institute]: `${institute?.instituteName} (${institute?.district}, ${institute?.province})` })
    }
  }

  return (
    <>
      <Title level={3}>ข้อมูลทั่วไป</Title>
      <Form
        name={FormProfileName.name}
        form={formProfile}
        labelCol={{ span: 4 }}
        // wrapperCol={{ span: 16 }}
        // style={style}
        // initialValues={{ remember: true }}
        onFinish={handleProfileSubmit}
      // autoComplete="off"
      >
        <Form.Item
          label="ชื่อ"
          name={FormProfileName.firstname}
          rules={[{ required: true, message: 'กรุณาระบุ ชื่อ' }]}
        >
          <Input
            disabled={profileDisabledForm}
            onInput={(e) => setProfile({ ...profile, firstName: e.currentTarget.value })}
          />
        </Form.Item>
        <Form.Item
          label="นามสกุล"
          name={FormProfileName.lastname}
          rules={[{ required: true, message: 'กรุณาระบุ นามสกุล' }]}
        >
          <Input
            disabled={profileDisabledForm}
            onInput={(e) => setProfile({ ...profile, lastName: e.currentTarget.value })}
          />
        </Form.Item>
        {/* <Form.Item
          label="วันเกิด"
          name={FormProfileName.birthdate}
          rules={[{ required: true, message: 'กรุณาระบุ วัน เดือน ปีเกิด' }]}
        >
          <DatePicker
            format={'YYYY-MM-DD'}
            disabled={profileDisabledForm}
            style={{ width: '100%' }}
            onChange={(_, dateString) => setProfile({ ...profile, birthdate: Array.isArray(dateString) ? dateString[0] : dateString })}
          />
        </Form.Item> */}
        <Form.Item
          label="โรงเรียน"
          name={FormProfileName.institute}
          rules={[{ required: true, message: 'กรุณาระบุ โรงเรียน' }]}
        >
          <AutoComplete
            disabled={profileDisabledForm}
            options={institutes}
            // options={ins}
            // filterOption={
            //   (inputValue, option) => option?.instituteName.indexOf(inputValue) !== -1
            // }
            // filterOption={(inputValue, option) => handleFilterOption(inputValue, option)}
            // onChange={(e) => setProfile({ ...profile, institute: e })}
            onChange={(e) => handleSetInstitute(e)}
          />
        </Form.Item>


        <Form.Item label={null}>
          <Flex gap="small">
            <Button disabled={profileDisabledForm} type="primary" htmlType="submit"> บันทึก </Button>
            <Button onClick={() => setProfileDisabledForm(false)} color="danger" variant="solid"> แก้ไข </Button>
          </Flex>
        </Form.Item>
      </Form >
    </>
  )
}
