import React, { useEffect, useMemo, useState } from "react"
import { fetchAPI } from "../utils"
import { useKeycloak } from "@react-keycloak/web";
import { AutoComplete, AutoCompleteProps, Button, Card, Col, DatePicker, Empty, Flex, Input, Radio, Row, Select, Skeleton, TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';
import Title from "antd/es/typography/Title";
import LongdoMap from "../components/LongdoMap";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import InstituteEnrollTable from "../components/InstituteEnrollTable";
// import useInfiniteScroll from "../utils/useInfiniteScroll";

type Course = {
  courseId: string;
  courseName: string;
  createAt: string;
  updateAt: string;
};

// type Institute = {
//   province: string
//   district: string
//   department: string
//   instituteName: string
//   instituteId: string
//   coordinates: string;
// };

type User = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
  createAt: string;
  updateAt: string;
};

type Query = {
  instituteId?: string;
  institute?: string;
  courseId?: string;
  course?: string;
  dateFrom?: string;
  dateTo?: string;
};

// type Enroll = {
//   enrollId?: string;
//   studentId?: string;
//   grade?: string;
//   level?: string;
//   classRoom?: string;
//   createAt?: string;
//   updateAt?: string;
//   user?: User;
//   course?: Course;
//   institute?: Institute;
// };

type ScrollOptions = {
  take: number;
  skip: number;
  hasEnd: boolean;
}

type ResponseInstitute = {
  province: string
  district: string
  department: string
  instituteName: string
  instituteId: string
  coordinates: { lat: number, long: number };
  createAt: string;
  updateAt: string;
  // user?: User;
  courses: {
    courseId: string;
    courseName: string;
    users: (User & {
      enrollCreateAt: string;
      enrollUpdateAt: string;
    })[];
  }[];
  userEnrollCount: number;
}

const titleStyle: React.CSSProperties = {
  margin: '0px 0px 14px'
}

export default function Home() {
  dayjs.extend(utc);
  const { RangePicker } = DatePicker;
  const { keycloak } = useKeycloak();
  const [query, setQuery] = useState<Query>();
  const [courses, setCourses] = useState<Course[]>();
  const [institutes, setInstitutes] = useState<ResponseInstitute[]>();
  const [institutesLocation, setInstitutesLocation] = useState<ResponseInstitute[]>();
  const [instituteCount, setInstituteCount] = useState<number>(0);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  // const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [position, setPosition] = useState<'table' | 'map'>('map');
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  // const [timer, setTimer] = useState<NodeJS.Timeout>();
  // const [institutes, setInstitutes] = useState<Institute[]>();
  // const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  const [scrollOptions, setScrollOptions] = useState<ScrollOptions>({ take: 200, skip: 0, hasEnd: false });
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const fetchInstituteCount = async (queryString?: string) => {
      const count = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll/institutes/count?${queryString}`, keycloak.token);
      setInstituteCount(count);
      console.log('count ' + count);
    }
    const fetchCourses = async () => {
      const courses: Course[] = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll/courses?order=ASC`, keycloak.token);
      // console.log(courses);
      if (courses) {
        setCourses(courses);
      }
    }
    const fetchInstitutesLocation = async (queryString?: string) => {
      // &take=-1&skip=-1
      const institutesLocation: ResponseInstitute[] = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll/institutes?${queryString}&take=-1&skip=-1`, keycloak.token);
      setInstitutesLocation(institutesLocation);
    }
    const fetchInstitutes = async (queryString?: string) => {
      // &take=-1&skip=-1
      
      const institutes: ResponseInstitute[] = await fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll/institutes?${queryString}`, keycloak.token);
      const hasEnd = institutes.length < scrollOptions.take;
      setScrollOptions({ ...scrollOptions, hasEnd });
      setInstitutes(institutes);
      setUserCount(institutes.reduce((prev, institute) => prev += institute.userEnrollCount, 0));
    }
    const queryString = handleQueryString();
    console.log(queryString);
    fetchInstituteCount(queryString);
    fetchCourses();
    if (query?.dateTo && query.dateFrom) {
      // fetchInstitutesLocation(queryString)
      fetchInstitutes(queryString);
    } else {
      setInstitutesLocation([]);
      setInstitutes([]);
    }
  }, [query]);

  const handleQueryString = () => {
    let queryString = '';
    if (query) {
      if (query.dateFrom && query.dateTo) {
        queryString += `createAt=${query.dateFrom},${query.dateTo}&`;
      }
      if (query.courseId) {
        queryString += `courseId=${encodeURIComponent(query.courseId)}&`;
      }
    }
    return queryString;
  }

  const fetchMoreData = () => {
    if ((institutes?.length || 0) < instituteCount) {
      const queryString = handleQueryString();
      const skip = scrollOptions.skip + scrollOptions.take;
      fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/enroll/institutes?${queryString}&take=${scrollOptions.take}&skip=${skip}`, keycloak.token).then((res: ResponseInstitute[]) => {
        setScrollOptions({ ...scrollOptions, skip });
        setInstitutes((prev) => ([...(prev || []), ...res]))
        setUserCount(res.reduce((prev, institute) => prev += institute.userEnrollCount, userCount));
      });
    } else {
      setScrollOptions((prev) => ({ ...prev, hasEnd: true }));
    }
  }

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
    // setIsLoading(true);
  }
  // const onSearch = (e: string) => {
  //   clearTimeout(timer);
  //   const newTimer = setTimeout(() => {
  //     setSearch(e.trim());
  //   }, 1500);
  //   setTimer(newTimer);
  // };

  const searchResult = (query: string) => {
    const search = query.trim();
    // if (!query) setSearch('');
    return institutes?.filter(rEnroll => {
      if (
        rEnroll.instituteName?.includes(search) ||
        rEnroll.courses?.some(course => course.users?.some(user => user.firstName.includes(search) || user.lastName.includes(search) || user.email.includes(search)))
      ) {
        return rEnroll;
      }
    }).map((mEnroll) => ({
      value: `${mEnroll.instituteName}`,
      label: (
        <>
          <Flex vertical>
            <Flex align="center" gap={'small'}>
              <HomeOutlined /> {mEnroll.instituteName}
            </Flex>

            {
              mEnroll.courses.reduce((pCourse, course) => {
                course.users.forEach(user => {
                  if (user.firstName.includes(search) || user.lastName.includes(search)) {
                    pCourse = (
                      <Flex align="center" gap={'small'}>
                        <UserOutlined /> {user.firstName} {user.lastName}
                      </Flex>
                    )
                  }
                });
                return pCourse;
              }, <></>)
            }
          </Flex>
        </>
      )
    }))
  };

  const handleDLF = () => {
    const queryString = handleQueryString();
    fetch(`${process.env.BASEURL}/api/kidbright/enroll/institutes/download?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type': 'text/csv;charset=utf-8,',
      },
    }).then((res) => {
      res.text().then((text) => {
        const csv = "\ufeff" + text;
        const blob = new Blob([csv], { type: "text/csv;charset=UTF-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enrolls.csv';
        a.click();
      });
    });
  }

  const memoInstitutes = useMemo(() => {
    if (search) {
      setScrollOptions((prev) => ({ ...prev, hasEnd: true }));
      return institutes?.filter(ins => ins.instituteName.includes(search || ''));
    }
    setScrollOptions((prev) => ({ ...prev, hasEnd: institutes?.length === instituteCount }));
    return institutes;
  }, [search, institutes]);

  const dataSourceLocation = useMemo(() => {
    if (Array.isArray(institutesLocation)) {
      const memoIns = institutesLocation.map((ins, insIndex) => {
        return {
          key: `${ins.instituteId}-${insIndex}`,
          instituteId: ins.instituteId,
          instituteName: ins.instituteName,
          coordinates: {
            lat: ins.coordinates.lat,
            long: ins.coordinates.long,
          },
          courses: ins.courses.map((course, index) => ({
            key: `${ins.instituteId}-${index}`,
            courseId: course.courseId,
            courseName: course.courseName,
            users: course.users.map((user, userIndex) => ({
              key: `${ins.instituteId}-user-${userIndex}-${user.userId}`,
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              enrollCreateAt: dayjs(user.enrollCreateAt).format('DD MMMM YYYY HH:mm:ss'),
            }))
          }))
        }
      })
      return memoIns;
    }
    return [];
  }, [institutesLocation]);

  const dataSource = useMemo(() => {
    if (Array.isArray(memoInstitutes)) {
      const memoIns = memoInstitutes.map((ins, insIndex) => {
        return {
          key: `${ins.instituteId}-${insIndex}`,
          instituteId: ins.instituteId,
          instituteName: ins.instituteName,
          coordinates: {
            lat: ins.coordinates.lat,
            long: ins.coordinates.long,
          },
          courses: ins.courses.map((course, index) => ({
            key: `${ins.instituteId}-${index}`,
            courseId: course.courseId,
            courseName: course.courseName,
            users: course.users.map((user, userIndex) => ({
              key: `${ins.instituteId}-user-${userIndex}-${user.userId}`,
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              enrollCreateAt: dayjs(user.enrollCreateAt).format('DD MMMM YYYY HH:mm:ss'),
            }))
          }))
        }
      })
      // setIsLoading(false)
      return memoIns;
    }
    return [];
  }, [memoInstitutes]);

  return (
    <>
      <Flex vertical gap={'middle'}>
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
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Card style={{ height: '150px' }}>
              <Title style={titleStyle} level={4}>ค้นหา</Title>
              <AutoComplete
                disabled={institutes?.length === 0}
                style={{ width: '100%' }}
                options={options}
                onChange={(e) => !e && setSearch('')}
                onSelect={(value) => setSearch(value)}
                onSearch={(value) => setOptions(value ? searchResult(value) : [])}
              >
                {search}
                <Input.Search placeholder="ค้นหา ชื่อ นามสกุล หรือ โรงเรียน" enterButton />
              </AutoComplete>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ height: '150px' }}>
              <Title style={titleStyle} level={4}>จำนวนผู้ลงทะเบียน</Title>
              {/* <Title style={{ ...titleStyle, textAlign: 'end' }} level={3}>{institutes?.length}</Title> */}
              <Title style={{ ...titleStyle, textAlign: 'end' }} level={3}>{userCount}</Title>
            </Card>
          </Col>
        </Row>
        <Flex justify="space-between" gap={'small'} style={{ width: '100%' }}>
          <Radio.Group disabled={institutes?.length === 0} value={position} onChange={(e) => { setPosition(e.target.value) }}>
            <Radio.Button value="table">Table</Radio.Button>
            <Radio.Button value="map">Map</Radio.Button>
          </Radio.Group>
          <Button disabled={institutes?.length === 0} style={{ backgroundColor: "#81B29A", color: "#fff" }} onClick={() => handleDLF()}>ดาวน์โหลดข้อมูลทั้งหมด</Button>
        </Flex>
        {
          (institutes?.length ?? 0) > 0
            ? (
              <InfiniteScroll
                dataLength={institutes?.length ?? 0}
                next={fetchMoreData}
                hasMore={!scrollOptions.hasEnd}
                loader={Array.from({ length: 4 }).map((_, skeIndex) => <Skeleton key={`skeleton-${skeIndex}`} active />)}
              >
                {
                  position === 'table' ? <InstituteEnrollTable institute={dataSource || []} /> : <LongdoMap institutes={dataSourceLocation || []} />
                }
              </InfiniteScroll>
            )
            : (
              <Flex vertical justify="center" style={{ height: '400px' }}>
                <Empty description={!query?.dateFrom && !query?.dateTo ? "กรุณาเลือก 'ช่วงวันที่' ในการค้นหา" : institutes?.length === 0 ? "ไม่พบข้อมูลที่ค้นหา" : undefined} />
              </Flex>

            )
        }

      </Flex>
      {/* <pre> {JSON.stringify(courses, null, 2)} </pre > */}
      {/* <pre> {JSON.stringify(enrolls, null, 2)} </pre > */}
      {/* <pre> {JSON.stringify(query, null, 2)} </pre > */}
      {/* <pre> {JSON.stringify(memoEnrolls?.filter(e => e.coordinates.lat === 0), null, 2)} </pre > */}
      {/* <pre> {JSON.stringify(memoEnrolls, null, 2)} </pre > */}
    </>
  )
}