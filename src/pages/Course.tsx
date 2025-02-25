import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { fetchAPI } from "../utils";
import { useKeycloak } from "@react-keycloak/web";

enum Label {
  ADD_CLASSROOM = 'เพิ่มห้องเรียน',
  SAVE = 'บันทึก',
}

type User = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
}

type Course = {
  courseId: string;
  courseName: string;
}

type Enroll = {
  classRoom: string;
  enrollId: string;
  grade: string;
  level: number;
  user: User;
  course: Course;
}

type Institute = {
  instituteId: string;
  instituteName: string;
  district: string;
  province: string;
  department: string;
  enrolls?: Enroll[];
}

type TeacherResponse = {
  teacherId: string;
  user: User;
  institute: Institute;
}

enum FORM_NAME {
  INSTIUTE = 'institute',
  GRADE = 'grade',
  LEVEL = 'level',
  CLASSROOM = 'classRoom',
}
const grades = {
  primary: 'ประถมศึกษา',
  secondary: 'มัธยมศึกษา',
  vocational: 'ปวช.',
  associate: 'ปวส.',
  bachelor: 'ปริญญาตรี',
  master: 'ปริญญาโท',
  doctoral: 'ปริญญาเอก'
};

type ClassRoom = {
  instituteId?: string;
  instituteName?: string;
  grade?: string;
  level?: string;
}

export default function Course() {
  const { Option } = Select;
  const { keycloak } = useKeycloak();
  const [isAddRoom, setIsAddRoom] = useState<boolean>(false)
  const [formTeacher] = Form.useForm();
  const [teacher, setTeacher] = useState<TeacherResponse>()
  const [classRoom, setClassRoom] = useState<ClassRoom>()

  useEffect(() => {
    // const fetchEnroll = async (instituteId: string) => {
    //   const enroll: Enroll[] = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll/institute/${instituteId}`, keycloak.token);
    //   if (enroll) {
    //     console.log(enroll);
    //   }
    // }
    // const fetchTeacherId = async () => {
    //   const teacher: TeacherResponse = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/teacher/${keycloak.tokenParsed?.sub}`, keycloak.token);
    //   if (teacher) {
    //     console.log(teacher);
        
    //     formTeacher.setFieldsValue({ [FORM_NAME.INSTIUTE]: `${teacher.institute.instituteName} (${teacher.institute.district}, ${teacher.institute.province})` });
    //     setTeacher(teacher);
    //     setClassRoom({ instituteId: teacher.institute.instituteId, instituteName: teacher.institute.instituteName });
    //     // fetchEnroll(teacher.institute.instituteId);
    //   }
    // }
    // fetchTeacherId();
    fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/teacher/${keycloak.tokenParsed?.sub}/enrolls`, keycloak.token).then((res: TeacherResponse) => {
      console.log(res);
      formTeacher.setFieldsValue({[FORM_NAME.INSTIUTE]: `${res.institute.instituteName} (${res.institute.district}, ${res.institute.province})`});
      setTeacher(res);
      setClassRoom({ instituteId: res.institute.instituteId, instituteName: res.institute.instituteName });
    })
  }, [])

  const enrolls = useMemo(() => {
    // console.log(teacher?.institute.enrolls);
    return teacher?.institute.enrolls?.map(enroll => ({ courseId: enroll.course.courseId, courseName: enroll.course.courseName }))
  }, [teacher])

  const handleSelectInstitute = async (e: string) => {
    setClassRoom({ ...classRoom, grade: e, })
    // await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/teacher/${keycloak.tokenParsed?.sub}/enrolls/${classRoom?.instituteId}`, keycloak.token).then(res => {
    //   console.log(res);
    // })
  }

  const handleSubmit = () => {
    console.log(formTeacher.getFieldsValue());

  }
  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Button style={{}} color="cyan" variant="solid" onClick={() => setIsAddRoom(true)}>{Label.ADD_CLASSROOM}</Button>
      </div>
      <Modal
        title={Label.ADD_CLASSROOM}
        open={isAddRoom}
        onCancel={() => setIsAddRoom(false)}
        onOk={handleSubmit}
        width={{
          xs: '95%',
          sm: '90%',
          md: '85%',
          lg: '80%',
          xl: '75%',
          xxl: '70%',
        }}
      >
        <Form
          name="study-information"
          form={formTeacher}
          labelCol={{ span: 3 }}
          // wrapperCol={{ span: 16 }}
          // style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          // onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="โรงเรียน"
            name={FORM_NAME.INSTIUTE}
            rules={[{ required: true, message: 'กรุณาระบุ โรงเรียน' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="ระดับชั้น"
            style={{ marginBottom: 16 }}
            required={true}
          >
            <Form.Item
              name={FORM_NAME.GRADE}
              rules={[{ required: true, message: 'กรุณาระบุ ระดับชั้น' }]}
              style={{ display: 'inline-block', width: 'calc(55% - 8px)', margin: '0 0' }}
            >
              <Select
                placeholder="กรุณาเลือก ระดับชั้น"
                onChange={(e) => handleSelectInstitute(e)}
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
              name={FORM_NAME.LEVEL}
              style={{ display: 'inline-block', width: 'calc(45% - 8px)', margin: '0 8px 0px 8px' }}
            >
              <Select
                placeholder="ชั้นปี"
                onChange={(e) => setClassRoom({ ...classRoom, grade: e })}
                allowClear
              >
                {
                  Array.from({ length: 6 }, (_, i) => i + 1).map((value, index) => (
                    <Option key={`${index}`} value={value.toString()}>{ } {value}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form.Item>
        </Form>
        {JSON.stringify(enrolls)}
        {/* <div style={{ textAlign: 'center' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div> */}
      </Modal>

    </>
  )
}