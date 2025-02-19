import { useKeycloak } from "@react-keycloak/web";
import { AutoComplete, Button, Flex, Form, Input, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import rawInstitutes from '../assets/all_institutes.json';
import ProfileData from "../components/ProfileData";
import { fetchAPI } from "../utils";

export default function CourseLanding() {

  type Study = {
    enrollId?: string;
    createAt?: Date;
    id?: string;
    userId: string | undefined;
    subjectId: string | undefined;
    subjectName: string | undefined;
    school: string | undefined;
    grade: string | undefined;
    level?: number;
    classRoom?: string;
    institute?: Institute;
  }

  type Institute = {
    province: string
    district: string
    department: string
    instituteName: string
    instituteId: number | string
  }

  type Enroll = {
    userId: string;
    courseId: string;
    instituteId: string;
    grade: string;
    level?: number;
    classRoom?: number;

  }

  const institutesData: Institute[] = rawInstitutes as Institute[];
  const institutes = institutesData.map((institute: Institute) => ({ ...institute, value: institute.instituteId, label: `${institute.instituteName} (${institute.district}, ${institute.province})` }));

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
  const [studyDisabledForm, setStudylDisabledForm] = useState<boolean>(false);

  const [formStudy] = Form.useForm();

  const [study, setStudy] = useState<Study>({
    userId: undefined,
    subjectId: undefined,
    subjectName: undefined,
    school: undefined,
    grade: undefined,
    level: undefined,
    classRoom: undefined
  });

  useEffect(() => {
    const fetchData = async () => {
      const f = await fetchAPI('GET', `${process.env.LMSURL}/${searchParams.get('usageId')}`).catch((error) => {
        // alert('ไม่สามารถดึงข้อมูลวิชาได้');
        console.error('"usageId" ไม่สามารถเรียกขอมูลวิชาได้', error);
      });
      if (f) {
        formStudy.setFieldsValue({ subjectId: f['courseKey'], subjectName: f['courseTitle'] });
        setStudy((prev) => ({
          ...prev,
          userId: keycloak.tokenParsed?.sub,
          subjectId: f['courseKey'],
          subjectName: f['courseTitle'],
        })
        )
      }
      // ===========================
      const fetchEnroll = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll/user/${keycloak.tokenParsed?.sub}`, keycloak.token).catch((error) => {
        // alert('ไม่สามารถดึงข้อมูลการเรียนได้');
        console.error('ไม่สามารถดึงข้อมูลการเรียนได้', error);
      });
      if (fetchEnroll) {
        console.log(fetchEnroll);
        if (fetchEnroll.course?.courseId === f?.courseKey) {
          setStudylDisabledForm(true);
        }
        // console.log(fetchEnroll.institute);
        formStudy.setFieldsValue({ school: `${fetchEnroll.institute.instituteName} (${fetchEnroll.institute.district}, ${fetchEnroll.institute.province})`, grade: fetchEnroll.grade, level: fetchEnroll.level, classRoom: fetchEnroll.classRoom });
        setStudy(prev => ({
          ...prev,
          school: fetchEnroll.institute.instituteId,
          ...fetchEnroll
        }))
      }
    };
    fetchData();
  }, [])

  // const ins = useMemo(async () => {
  //   setTimeout(async () => {
  //     console.log('tt');
  //     // const ins = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/institute?instituteName=${study.school}`, keycloak.token);
  //     // console.log(ins);
  //   }, 1000);
  //   // const ins = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/institute?instituteName=${study.school}`, keycloak.token)
  //   // console.log(ins);
  // }, [study.school])

  const handleStudySubmit = async (): Promise<void> => {
    // console.log(study);
    // console.log(
    //   institutes.filter(ins => ins.value === study.school)[0]
    // );
    await fetchAPI('POST', `${process.env.BASEURL}/api/kidbright/course`, keycloak.token, {
      courseId: study.subjectId,
      courseName: study.subjectName
    }).catch((error) => {
      console.error(error);
    });
    // const institute = institutes.filter(ins => ins.value === study.school)[0]
    // const instituteId: Institute = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/institute/${institute.instituteId}`, keycloak.token).catch((error) => {
    //   console.error(error);
    // });
    // if (!instituteId) {
    //   const { instituteId, instituteName, department, district, province } = institute;
    //   await fetchAPI('POST', `${process.env.BASEURL}/api/kidbright/institute`, keycloak.token, {
    //     instituteId,
    //     instituteName,
    //     department,
    //     district,
    //     province
    //   } as Institute).catch((error) => {
    //     console.error(error);
    //   });
    //   // console.log({instituteId, instituteName, department, district, province});
    //   // console.log(instituteRes);
    // }
    // console.log(study.createAt);

    await fetchAPI(study.createAt ? 'PATCH' : 'POST', `${process.env.BASEURL}/api/kidbright/enroll/${study.createAt ? study.enrollId : ''}`, keycloak.token, {
      ...(study.enrollId && { enrollId: study.enrollId }),
      userId: study.userId,
      courseId: study.subjectId,
      instituteId: study.school,
      grade: study.grade,
      ...(study.level && { level: study.level }),
      ...(study.classRoom && { classRoom: study.classRoom })
    } as Enroll).then(() => {
      alert('บันทึกข้อมูลเรียบร้อย');
      setStudylDisabledForm(true);
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleEditStudyForm = (): void => {
    setStudylDisabledForm(false);
  }

  const handleSetFieldInstitute = (e: string) => {
    setStudy({ ...study, school: e })
    const ins = institutes.filter(ins => ins.instituteId === e)[0]
    if (ins) {
      formStudy.setFieldsValue({ school: `${ins?.instituteName} (${ins?.district}, ${ins?.province})` || e })
    }
  }

  return (
    <>
      <div>
        <ProfileData />
      </div>
      <div>
        <Title level={3}>ข้อมูลการเรียน</Title>
        <Form
          name="study-information"
          form={formStudy}
          labelCol={{ span: 4 }}
          // wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
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
            {/* <Input
              disabled={studyDisabledForm}
              onInput={(e) => setStudy({ ...study, school: e.currentTarget.value })}
              /> */}
            <AutoComplete
              disabled={studyDisabledForm}
              options={institutes}
              // options={ins}
              filterOption={
                (inputValue, option) => option?.instituteName.indexOf(inputValue) !== -1
              }
              // filterOption={(inputValue, option) => handleFilterOption(inputValue, option)}
              onChange={(e) => handleSetFieldInstitute(e)}
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
                }}
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
              // rules={[{ required: ['primary', 'secondary'].includes(study.grade || ''), message: 'กรุณาระบุ ชั้น' }]}
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
                // ({ getFieldValue }) => ({
                //   validator(_, value) {
                //     if (!['primary', 'secondary'].includes(getFieldValue('grade')) || value) {
                //       return Promise.resolve();
                //     }
                //     return Promise.reject(new Error('กรุณาระบุ ห้อง'));
                //   },
                // })
              ]}
              style={{ display: 'inline-block', width: 'calc(33% - 0px)', margin: '0 0px' }}
            >
              <Input
                disabled={studyDisabledForm || !['primary', 'secondary'].includes(study.grade || '')}
                allowClear
                onChange={(e) => parseInt(e.target.value) > 0 && setStudy({ ...study, classRoom: e.target.value })}
                placeholder='ห้อง' />
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
      {/* <div style={{ textAlign: 'right' }}>
        <Button onClick={() => keycloak.logout()} color="orange" variant="solid">
          ออกจากระบบ
        </Button>
      </div> */}
    </>
  )
}
