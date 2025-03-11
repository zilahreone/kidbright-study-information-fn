import React, { useEffect, useMemo, useState } from "react"
import { fetchAPI } from "../utils"
import { useKeycloak } from "@react-keycloak/web";
import { Card, Col, DatePicker, Flex, Row, Select, Skeleton, Table, TimeRangePickerProps, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';
import Title from "antd/es/typography/Title";
import Search from "antd/es/input/Search";
// import useInfiniteScroll from "../utils/useInfiniteScroll";

type Course = {
  courseId: string;
  courseName: string;
  createAt: string;
  updateAt: string;
};

type Institute = {
  province: string
  district: string
  department: string
  instituteName: string
  instituteId: string
};

type User = {
  userId?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: string;
  createAt?: string;
  updateAt?: string;
};

type Query = {
  instituteId?: string;
  institute?: string;
  courseId?: string;
  course?: string;
  dateFrom?: string;
  dateTo?: string;
};

type Enroll = {
  enrollId?: string;
  studentId?: string;
  grade?: string;
  level?: string;
  classRoom?: string;
  createAt?: string;
  updateAt?: string;
  user?: User;
  course?: Course;
  institute?: Institute;
};

const titleStyle: React.CSSProperties = {
  margin: '0px 0px 14px'
}

export default function Home() {
  dayjs.extend(utc);
  const { RangePicker } = DatePicker;
  const { keycloak } = useKeycloak();
  const [query, setQuery] = useState<Query>();
  const [courses, setCourses] = useState<Course[]>();
  const [enrolls, setEnrolls] = useState<Enroll[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  // const [timer, setTimer] = useState<NodeJS.Timeout>();
  // const [institutes, setInstitutes] = useState<Institute[]>();
  // const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  // function fetchMoreListItems() {
  //   console.log('fetch');
  //   setTimeout(() => {
  //     // setListItems(prevState => ([...prevState, ...Array.from(Array(20).keys(), n => n + prevState.length + 1)]));
  //     setIsFetching(false);
  //   }, 2000);
  // }

  // const handleSetInstitute = async (value: string) => {
  //   clearTimeout(timer)
  //   const newTimer = setTimeout(async () => {
  //     await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/institute?instituteName=${value}`, keycloak.token).then((res: Institute[]) => {
  //       if (res.length > 0) setInstitutes(res.map(institute => ({ ...institute, value: institute.instituteId, label: `${institute.instituteName} (${institute.district}, ${institute.province})` })))
  //     })
  //   }, 1500)
  //   setTimer(newTimer)
  //   const institute = institutes?.filter(ins => ins.instituteId === value)[0];
  //   // if (institute) {
  //   //   setQuery({ ...query, institute: institute.instituteName, instituteId: institute.instituteId })
  //   // }
  //   setQuery({ ...query, institute: institute ? `${institute.instituteName} (${institute.district}, ${institute.province})` : value, instituteId: institute?.instituteId })
  // }

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      setQuery({ ...query, dateFrom: dateStrings[0], dateTo: dateStrings[1] });
    } else {
      setQuery({ ...query, dateFrom: undefined, dateTo: undefined });
      // console.log('Clear');
    }
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Today', value: [dayjs().add(0, 'd'), dayjs()] },
    { label: 'Last 1 Day', value: [dayjs().add(-1, 'd'), dayjs()] },
    { label: 'Last 2 Day', value: [dayjs().add(-2, 'd'), dayjs()] },
    { label: 'Last 3 Day', value: [dayjs().add(-3, 'd'), dayjs()] },
    { label: 'Last 5 Days', value: [dayjs().add(-5, 'd'), dayjs()] },
    //   { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    //   { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    //   { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];

  const handleSelectCourse = (option: any) => {
    if (option) {
      setQuery({ ...query, courseId: option.value, course: option.label })
    } else {
      setQuery({ ...query, courseId: undefined, course: undefined })
    }
    setIsLoading(true);
  }

  useEffect(() => {
    const fetchCourses = async () => {
      await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/course`, keycloak.token).then((res: Course[]) => {
        setCourses(res);
      });
    }
    const fetchEnrolls = async (queryString?: string) => {
      await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll${queryString && queryString}`, keycloak.token).then((res: Enroll[]) => {
        setEnrolls(res);
      });
    }
    if (query) {
      let queryString = '?';
      if (query.dateFrom && query.dateTo) {
        queryString += `createAt=${query.dateFrom},${query.dateTo}&`;
      }
      if (query.courseId) {
        queryString += `courseId=${encodeURIComponent(query.courseId)}&`;
      }
      fetchEnrolls(queryString);
    } else {
      fetchCourses();
    }
  }, [query]);

  const memoEnrolls = useMemo(() => {
    type EnrollCreatedUpdated = {
      enrollCreateAt?: string;
      enrollUpdateAt?: string;
    }
    type Course = {
      courseId?: string;
      courseName?: string;
      users?: Array<User & EnrollCreatedUpdated>;
    };
    type PrevEnroll = {
      enrollId?: string;
      instituteId?: string;
      instituteName?: string;
      courses?: Course[];
    }
    const reduceEnrolls = enrolls?.reduce((prev: PrevEnroll[], enroll: Enroll) => {
      const enrollObj: PrevEnroll = {
        enrollId: enroll.enrollId,
        instituteId: enroll.institute?.instituteId,
        instituteName: enroll.institute?.instituteName,
        courses: [] as Course[],
      }
      const courseObj: Course = {
        courseId: enroll.course?.courseId,
        courseName: enroll.course?.courseName,
        users: [] as User[] & EnrollCreatedUpdated
      };
      const userObj: User & EnrollCreatedUpdated = {
        userId: enroll.user?.userId,
        userName: enroll.user?.userName,
        firstName: enroll.user?.firstName,
        lastName: enroll.user?.lastName,
        email: enroll.user?.email,
        birthdate: enroll.user?.birthdate,
        enrollCreateAt: enroll.createAt,
        enrollUpdateAt: enroll.updateAt
      };
      if (!prev.some((enrollItem) => enrollItem.instituteId === enroll.institute?.instituteId)) {
        courseObj.users?.push(userObj);
        enrollObj.courses?.push(courseObj);
        prev.push(enrollObj);
      } else {
        let instituteIndex = prev.findIndex((enrollItem) => enrollItem.instituteId === enroll.institute?.instituteId);
        if (prev[instituteIndex].courses && !prev[instituteIndex].courses.some((courseItem) => courseItem.courseId === enroll.course?.courseId)) {
          courseObj.users?.push(userObj);
          prev[instituteIndex].courses.push(courseObj);
        } else {
          let courseIndex = prev[instituteIndex].courses?.findIndex((courseItem) => courseItem.courseId === enroll.course?.courseId) ?? -1;
          // if (prev[instituteIndex].courses && prev[instituteIndex].courses[courseIndex]) {
          if (prev[instituteIndex].courses && !prev[instituteIndex].courses[courseIndex].users?.some((user) => user.userId === enroll.user?.userId)) {
            prev[instituteIndex].courses[courseIndex].users?.push(userObj);
          }
        }
      }
      return prev;
    }, [] as PrevEnroll[]);
    if (search) {
      return reduceEnrolls?.filter(rEnroll => {
        if (rEnroll.instituteName?.includes(search) || rEnroll.courses?.some(course => course.users?.some(user => [ user.userName, user.firstName, user.firstName, user.email].includes(search)))) {
          return rEnroll;
        }
      })
    }
    return reduceEnrolls;
  }, [enrolls, search]);

  const memoCount = useMemo(() => {
    setIsLoading(false);
    return memoEnrolls?.reduce((prev, enroll) => {
      return prev + (enroll.courses ?? []).reduce((prevCourse, course) => {
        return prevCourse + (course.users ? course.users.length : 0);
      }, 0);
    }, 0);
  }, [memoEnrolls]);

  const onSearch = (e: string) => {
    setSearch(e.trim());
  }

  return (
    <>
      <Flex vertical gap={'middle'}>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Card style={{ height: '150px' }}>
              <Title style={titleStyle} level={4}>ค้นหา</Title>
              <Search placeholder="ค้นหา ชื่อ หรือ โรงเรียน และอื่นๆ" allowClear onSearch={onSearch} />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ height: '150px' }}>
              <Title style={titleStyle} level={4}>จำนวนผู้ลงทะเบียน</Title>
              <Title style={{ ...titleStyle, textAlign: 'end' }} level={3}>{memoCount}</Title>
            </Card>
          </Col>
        </Row>
        {/* <AutoComplete
          value={query?.institute}
          placeholder={'กรุณราเลือกโรงเรียน'}
          style={{ width: '40%' }}
          options={institutes}
          onChange={(e) => handleSetInstitute(e)}
        /> */}
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <RangePicker style={{ width: '100%' }} presets={rangePresets} onChange={onRangeChange} />
          </Col>
          <Col span={16}>
            <Select
              allowClear
              value={query?.course}
              placeholder={'กรุณาเลือก วิชา'}
              style={{ width: '100%' }}
              onChange={(_, option: any) => handleSelectCourse(option)}
              options={courses?.map(course => ({ value: course.courseId, label: course.courseName }))}
            />
          </Col>
        </Row>
        {
          isLoading
            ? Array.from({ length: 4 }).map((_, skeIndex) => <Skeleton key={`skeleton-${skeIndex}`} active />)
            : memoEnrolls?.map((mEnroll, eIndex) => {
              return (
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
                                { title: 'ชื่อ', dataIndex: 'userName' },
                                { title: 'ชื่อจริง', dataIndex: 'firstName' },
                                { title: 'นามสกุล', dataIndex: 'lastName' },
                                { title: 'Email', dataIndex: 'email' },
                                // { title: 'วันเกิด', dataIndex: 'birthdate' },
                                { title: 'เวลาลงทะเบียน', dataIndex: 'enrollCreated' },
                                // { title: 'เวลาอัพเดทข้อมูล', dataIndex: 'enrollUpdated' }
                              ]}
                              dataSource={mCourse.users?.map((user, index) => ({
                                key: `user-${index}-${user.userId}`,
                                ...user,
                                // birthdate: dayjs(user.birthdate).utcOffset(-1).format('DD MMMM YYYY'),
                                // birthdate: dayjs(user.birthdate).utcOffset(-1).format('DD MMMM YYYY HH:mm:ss'),
                                enrollCreated: dayjs(user.enrollCreateAt).format('DD MMMM YYYY HH:mm:ss'),
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
                // <div key={mEnroll.instituteId}>
                //   <h1>{mEnroll.instituteName}</h1>

                // </div>
              )
            })
        }
      </Flex>
      {/* <pre> {JSON.stringify(courses, null, 2)} </pre > */}
      {/* <pre> {JSON.stringify(enrolls, null, 2)} </pre > */}
      {/* <pre> {JSON.stringify(query, null, 2)} </pre > */}
      {/* <pre> {JSON.stringify(memoEnrolls, null, 2)} </pre > */}
    </>
  )
}