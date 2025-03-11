import { Button, Card, Collapse, Flex, Form, Input, Modal, notification, Select, Table, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { fetchAPI } from "../utils";
import { useKeycloak } from "@react-keycloak/web";
import { CaretRightOutlined, CheckCircleFilled, CloseOutlined } from "@ant-design/icons";

enum Label {
  ADD_CLASSROOM = 'เพิ่มห้องเรียน',
  SAVE = 'บันทึก',
  SELECT_ALL = 'เลือกทั้งหมด',
};

type User = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate?: string;
};

type Course = {
  courseId: string;
  courseName: string;
  isActivated: boolean;
};

type Enroll = {
  enrollId: string;
  classRoom: string;
  grade: string;
  level: number;
  user: User;
  course: Course;
};

type Institute = {
  instituteId: string;
  instituteName: string;
  district: string;
  province: string;
  department: string;
  enrolls: Enroll[];
};

type TeacherResponse = {
  teacherId: string;
  user: User;
  institute: Institute;
};

enum FORM_NAME {
  INSTIUTE = 'institute',
  GRADE = 'grade',
  LEVEL = 'level',
  CLASSROOM = 'classRoom',
};
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
};

type NotificationType = 'success' | 'info' | 'warning' | 'error';

type Placement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

type AssignRequest = {
  userId: string;
  courseId: string;
  teacherId: string;
};

type Assign = {
  assignId: string;
  course: Course;
  users: User[];
};

export default function Course() {
  const { Option } = Select;
  const { keycloak } = useKeycloak();
  const [isAddRoom, setIsAddRoom] = useState<boolean>(false);
  const [formTeacher] = Form.useForm();
  const [teacher, setTeacher] = useState<TeacherResponse>();
  const [classRoom, setClassRoom] = useState<ClassRoom>();
  const [api, contextHolder] = notification.useNotification();
  const [assigns, setAssigns] = useState<Assign[]>();

  const { Text } = Typography;

  useEffect(() => {
    const fetchResources = async () => {
      const assigns: Assign[] = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/assign/teacher/${keycloak.tokenParsed?.sub}`, keycloak.token);
      const teacher: TeacherResponse = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/teacher/${keycloak.tokenParsed?.sub}`, keycloak.token).catch((err: Response) => {
        if (err.status === 404) {
          openNotificationWithIcon('warning', 'topRight', 'ไม่มีข้อมูลผู้สอนในระบบ', 'กรุณาลงทะเบียนผู้สอนก่อนเข้าใช้งาน');
        }
      });
      if (assigns && assigns.length > 0) {
        setAssigns(assigns);
      }
      if (teacher) {
        setClassRoom({ instituteId: teacher.institute.instituteId, instituteName: teacher.institute.instituteName });
        formTeacher.setFieldsValue({ [FORM_NAME.INSTIUTE]: `${teacher.institute.instituteName} (${teacher.institute.district}, ${teacher.institute.province})` });
        setTeacher({
          ...teacher,
          institute: {
            ...teacher.institute,
            enrolls: teacher.institute.enrolls.reduce((prev: Enroll[], enroll) => {
              if (!prev.some(p => p.course.courseId === enroll.course.courseId)) {
                prev.push({
                  ...enroll,
                  course: {
                    ...enroll.course,
                    isActivated: false
                  }
                });
              }
              return prev;
            }, []).filter(fEnroll => !assigns.some(assign => assign.course.courseId === fEnroll.course.courseId))
          }
        });
      }
    }
    fetchResources();
  }, []);

  const memoEnrolls = useMemo(() => {
    return teacher?.institute.enrolls?.map((enroll) => enroll.course);
  }, [teacher]);

  const openNotificationWithIcon = (type: NotificationType, placement: Placement, message: string, desc: string) => {
    api.open({
      type: type,
      message: message,
      description: desc,
      placement: placement,
      showProgress: true,
      pauseOnHover: true,
      duration: 4
    });
  };

  const handleSelectInstitute = async (e: string) => {
    setClassRoom({ ...classRoom, grade: e, })
    // await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/teacher/${keycloak.tokenParsed?.sub}/enrolls/${classRoom?.instituteId}`, keycloak.token).then(res => {
    //   console.log(res);
    // })
  }

  const handleSubmit = () => {
    for (const enroll of teacher?.institute.enrolls || []) {
      if (enroll.course.isActivated) {
        fetchAPI('POST', `${process.env.BASEURL}/api/kidbright/assign`, keycloak.token, {
          userId: teacher?.teacherId,
          courseId: enroll.course.courseId,
          teacherId: teacher?.teacherId
        } as AssignRequest).then((res: Assign) => {
          setAssigns((prev) => [res, ...(prev || [])])
        });
      }
    }
    setIsAddRoom(false);
  }

  const handleSelectCourse = (course: Course) => {
    const enroll: Enroll[] | undefined = teacher?.institute.enrolls?.map((enroll) => ({
      ...enroll,
      course: {
        ...enroll.course,
        isActivated: enroll.course.courseId === course.courseId ? !enroll.course.isActivated : enroll.course.isActivated
      }
    }));
    if (teacher && enroll) {
      setTeacher({
        ...teacher,
        institute: {
          ...teacher.institute,
          enrolls: enroll
        }
      });
    }
  }

  const handleSelectAll = () => {
    const enroll: Enroll[] | undefined = teacher?.institute.enrolls?.map((enroll) => {
      if (teacher?.institute.enrolls.every((enroll) => enroll.course.isActivated)) {
        return { ...enroll, course: { ...enroll.course, isActivated: false } };
      };
      return { ...enroll, course: { ...enroll.course, isActivated: true } };
    });
    if (teacher && enroll) {
      setTeacher({
        ...teacher,
        institute: {
          ...teacher.institute,
          enrolls: enroll
        }
      });
    };
  };

  const handleSelectAssign = (assignIndex: number) => {
    if (assigns && !assigns[assignIndex].users) {
      fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll?courseId=${encodeURIComponent(assigns[assignIndex].course.courseId)}&instituteId=${teacher?.institute.instituteId}`, keycloak.token).then((res: Enroll[]) => {
        console.log(res);

        const users = res.reduce((prev: User[], enroll) => {
          if (!prev.some(p => p.userId === enroll.user.userId)) {
            prev.push(enroll.user);
          }
          return prev;
        }, [])
        // console.log(users);
        setAssigns(assigns.map(assign => {
          if (assign.assignId === assigns[assignIndex].assignId) {
            assign.users = [...users]
          }
          return assign;
        }))
      })
    }
    console.log(assignIndex);
  };

  const handleDeleteAssign = (assignId: string) => {
    fetchAPI('DELETE', `${process.env.BASEURL}/api/kidbright/assign/${assignId}`, keycloak.token).then(() => {
      setAssigns(assigns?.filter(assign => assign.assignId !== assignId));
    });
  };

  return (
    <>
      {contextHolder}
      <div style={{ textAlign: 'right' }}>
        <Button style={{}} color="cyan" variant="solid" onClick={() => setIsAddRoom(true)}>{Label.ADD_CLASSROOM}</Button>
      </div>
      {/* <div>
        <pre>{JSON.stringify(assigns, null, 2)}</pre>
      </div> */}
      <Flex gap="small" vertical style={{ paddingTop: '30px' }}>
        {
          assigns?.map((assign, assignIndex) => (
            <Card
              key={`assign-${assignIndex}`}
            // hoverable
            // onClick={() => handleSelectAssign(assignIndex)}
            >
              <Flex justify="space-between" align="center">
                <div>
                  <p>
                    <Text strong>รหัสวิชา : </Text>{assign.course.courseId}
                  </p>
                  <p>
                    <Text strong>ชื่อวิชา : </Text>{assign.course.courseName}
                  </p>
                </div>
                <CloseOutlined onClick={(e) => (handleDeleteAssign(assign.assignId), e.stopPropagation())} style={{ color: '#E07A5F', fontSize: '24px' }} />
              </Flex>
              <Collapse
                key={`collapse-${assignIndex}`}
                onChange={(e: Array<string>) => (e[0] && !assign.users) && handleSelectAssign(assignIndex)}
                ghost
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                expandIconPosition="start"
                items={[{
                  styles: { header: { padding: '0px 0px 0px' } },
                  key: `collapse-${assignIndex}`,
                  label: <Text strong>รายชื่อผู้ลงทะเบียน</Text>,
                  children: <Table
                    pagination={false}
                    columns={[
                      { title: 'ชื่อ', dataIndex: 'userName' },
                      { title: 'ชื่อจริง', dataIndex: 'firstName' },
                      { title: 'นามสกุล', dataIndex: 'lastName' },
                      { title: 'Email', dataIndex: 'email' },
                    ]}
                    dataSource={assign.users?.map((user, userIndex) => ({
                      key: `user-${userIndex}-${user.userId}`,
                      ...user,
                    }))}
                  />
                }]}
              />
            </Card>
          ))
        }
      </Flex>
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
        {/* <pre> {JSON.stringify(memoEnrolls, null, 2)} </pre> */}
        {
          memoEnrolls?.map((course, index) => (
            <Card
              key={`enroll-${index}`}
              size="small"
              style={{ marginBottom: 8, ...(course.isActivated && { borderColor: '#81B29A' }) }}
              hoverable
              onClick={() => handleSelectCourse(course)}
            >
              <Flex justify="space-between">
                {course.courseName}
                {
                  course.isActivated && <CheckCircleFilled style={{ color: '#81B29A' }} />
                }
              </Flex>
            </Card>
            // <div key={`enroll-${index}`}>{course.courseName}</div>
          ))
        }
        {/* <div style={{ textAlign: 'center' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div> */}
        <Button style={{ color: '#81B29A' }} onClick={handleSelectAll}>{Label.SELECT_ALL}</Button>
      </Modal>

    </>
  )
}