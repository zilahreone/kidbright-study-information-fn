import { Card, Col, Flex, Row, Table } from "antd";

type instituteProps = {
  key?: string;
  instituteId: string;
  instituteName: string;
  coordinates: { lat: number, long: number },
  courses: {
    key?: string;
    courseId: string;
    courseName: string;
    users: {
      key?: string;
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      enrollCreateAt: string;
    }[]
  }[]
}

export default function InstituteEnrollTable({ institute }: { institute: instituteProps | instituteProps[] }) {
  // const [data, setData] = useState<any[]>([]);
  return (
    // <pre>
    //   {
    //     JSON.stringify(data, null, 2)
    //   }
    // </pre>
    <>
      {
        Array.isArray(institute)
          ? (
            institute.map((ins) => (
              <Card key={ins.key} title={`โรงเรียน : ${ins.instituteName}`}>
                <Flex vertical gap={'middle'}>
                  {
                    ins.courses?.map((course) => {
                      return (
                        <Card key={course.key} type="inner" title={`วิชา : ${course.courseName}`}>
                          {/* <List
                            size="small"
                            bordered
                            dataSource={course.users?.map((user, index) => ({
                              key: `${ins.instituteId}-user-${index}-${user.userId}`,
                              firstName: user.firstName,
                              lastName: user.lastName,
                              email: user.email,
                              enrollCreateAt: user.enrollCreateAt
                            }))}
                            renderItem={item => <List.Item>{item.firstName}</List.Item>}
                          /> */}
                          {/* <Table
                            // loading={false}
                            rowKey='key'
                            pagination={false}
                            // className={styles.customTable}
                            columns={[
                              // { title: 'Id', dataIndex: 'userId' },
                              // { title: 'ชื่อ', dataIndex: 'userName' },
                              { title: 'ชื่อ', dataIndex: 'firstName' },
                              { title: 'นามสกุล', dataIndex: 'lastName' },
                              { title: 'อีเมล', dataIndex: 'email' },
                              // { title: 'วันเกิด', dataIndex: 'birthdate' },
                              { title: 'เวลาลงทะเบียน', dataIndex: 'enrollCreateAt' },
                              // { title: 'เวลาอัพเดทข้อมูล', dataIndex: 'enrollUpdated' }
                            ]}
                            dataSource={course.users}
                          // scroll={{ y: 300 }}
                          /> */}
                          <Row style={{ fontWeight: 'bold', padding: '10px 0' }}>
                            <Col span={5}>ชื่อ</Col>
                            <Col span={5}>นามสกุล</Col>
                            <Col span={8}>อีเมล</Col>
                            <Col span={6}>เวลาลงทะเบียน</Col>
                          </Row>
                          {
                            course.users.map((user, index) => (
                              <Row key={`user-${index}`} style={{ padding: '5px 0' }}>
                                <Col span={5}>{ user.firstName }</Col>
                                <Col span={5}>{ user.lastName }</Col>
                                <Col span={8}>{ user.email }</Col>
                                <Col span={6}>{ user.enrollCreateAt }</Col>
                              </Row>
                            ))
                          }
                        </Card>
                      )
                    })
                  }
                </Flex>
              </Card>
            ))
          )
          : (
            <Card title={`โรงเรียน : ${institute.instituteName}`}>
              <Flex vertical gap={'middle'}>
                {
                  institute.courses?.map((course, index) => {
                    return (
                      <Card key={`course-${institute.instituteId}-${index}`} type="inner" title={`วิชา : ${course.courseName}`}>
                        {/* <Table>
                          <Column title="ชื่อจริง" dataIndex="firstName" key="firstName" />
                          <Column title="นามสกุล" dataIndex="lastName" key="lastName" />
                          <Column title="Email" dataIndex="email" key="email" />
                          <Column title="เวลาลงทะเบียน" dataIndex="enrollCreateAt" key="enrollCreateAt" />
                        </Table> */}
                      </Card>
                    )
                  })
                }
              </Flex>
            </Card>
          )
      }
    </>
  )


}