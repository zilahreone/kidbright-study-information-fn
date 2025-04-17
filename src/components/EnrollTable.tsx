import { Card, Flex, Table } from "antd";

export default function EnrollTable({ enrolls }: {
  enrolls: {
    instituteId: string;
    instituteName: string;
    coordinates: { lat: number, long: number },
    courses: {
      courseId: string;
      courseName: string;
      users: {
        userId: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        birthdate: string;
        enrollCreateAt: string;
        enrollUpdateAt: string;
      }[]
    }[]
  }[]
}) {
  return enrolls?.map((mEnroll, eIndex) => {
    return (
      // <div key={`eEnroll-${eIndex}`}>{ mEnroll.instituteName }</div>
      <Card key={`eEnroll-${eIndex}`} title={`โรงเรียน : ${mEnroll.instituteName}`}>
        <Flex vertical gap={'middle'}>
          {
            mEnroll.courses?.map((mCourse, cIndex) => {
              return (
                <Card key={`eCourse-${cIndex}`} type="inner" title={`วิชา : ${mCourse.courseName}`}>
                  <Table
                    pagination={false}
                    // className={styles.customTable}
                    columns={[
                      // { title: 'Id', dataIndex: 'userId' },
                      // { title: 'ชื่อ', dataIndex: 'userName' },
                      { title: 'ชื่อจริง', dataIndex: 'firstName' },
                      { title: 'นามสกุล', dataIndex: 'lastName' },
                      { title: 'Email', dataIndex: 'email' },
                      // { title: 'วันเกิด', dataIndex: 'birthdate' },
                      { title: 'เวลาลงทะเบียน', dataIndex: 'enrollCreateAt' },
                      // { title: 'เวลาอัพเดทข้อมูล', dataIndex: 'enrollUpdated' }
                    ]}
                    dataSource={mCourse.users?.map((user, index) => ({
                      key: `user-${index}-${user.userId}`,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      enrollCreateAt: user.enrollCreateAt,
                      // birthdate: dayjs(user.birthdate).utcOffset(-1).format('DD MMMM YYYY'),
                      // birthdate: dayjs(user.birthdate).utcOffset(-1).format('DD MMMM YYYY HH:mm:ss'),
                      // enrollCreated: dayjs(user.enrollCreateAt).format('DD MMMM YYYY HH:mm:ss'),
                      // enrollUpdated: dayjs(mEnroll.updateAt).format('DD MMMM YYYY HH:mm:ss')
                    }))}
                  // scroll={{ y: 300 }}
                  />
                </Card>
              )
            })
          }
        </Flex>
      </Card>
    )
  })
}