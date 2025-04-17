import { Button, Flex } from "antd";
import { useEffect, useState } from "react";
// import { fetchAPI } from "../utils";
// import LongdoMap from "../components/LongdoMap";
// import { useKeycloak } from "@react-keycloak/web";

enum Label {
  REGION = 'เขตการปกครอง',
  DEPARTMENT = 'สังกัด',
}

type SelectFilter = 'region' | 'department';

export type Institute = {
  instituteId: number;
  instituteName: string;
  district: string;
  province: string;
  department: string;
  coordinates: string;
}

// type DepartmentOrRegion = {
//   name: string;
//   institutes: Institute[];
// }

// type Ins = {
//   instituteName: string,
//   coordinates: {
//     lat: number;
//     long: number
//   }
// }

// const { Text } = Typography;

export default function Home2() {

  // const { keycloak } = useKeycloak();
  const [selectFilter, setSelectFilter] = useState<SelectFilter>('region');
  // const [regions, setRegions] = useState<DepartmentOrRegion[]>();
  // const [departments, setDepartments] = useState<DepartmentOrRegion[]>();
  // const [institutes, setInstitutes] = useState<Institute[]>();

  useEffect(() => {
    // fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/institute`, keycloak.token).then((res: Institute[]) => {
    //   setInstitutes(
    //     res.filter(filter => filter.coordinates)
    //     // .map((institute): Ins => {
    //     //   const match = institute.coordinates.match(/\((.*)\)/);
    //     //   const co = match ? match[1].split(/\s/g) : [];
    //     //   return {
    //     //     instituteName: institute.instituteName,
    //     //     coordinates: {
    //     //       lat: Number(co[1]),
    //     //       long: Number(co[0])
    //     //     }
    //     //   }
    //     // })
    //   )
    //   // setDepartments(res);
    //   // setRegions(
    //   //   res.reduce((prev, institute) => {
    //   //     let departmentOrRegion: DepartmentOrRegion = {
    //   //       name: handleRegionThailand(institute.province),
    //   //       institutes: [institute]
    //   //     }
    //   //     if (!prev.some(p => p.name === departmentOrRegion.name)) {
    //   //       prev.push(departmentOrRegion);
    //   //     } else {
    //   //       const pIndex = prev.findIndex(p => p.name === departmentOrRegion.name);
    //   //       // console.log(pIndex);
    //   //       // prev[pIndex].institutes.push(institute);
    //   //     }
    //   //     return prev;
    //   //   }, [] as DepartmentOrRegion[])
    //   // );
    // }).catch(error => {
    //   console.error(error);
    // });
  }, [])

  const filterStyle = (select: SelectFilter): React.CSSProperties => {
    if (selectFilter === select) {
      return {
        color: '#FFF',
        backgroundColor: '#81B29A',
        borderColor: '#81B29A',
      }
    }
    return {
      borderColor: '#81B29A',
    }
  }

  // const handleRegionThailand = (province: string) => {
  //   const bangkokother = ['กรุงเทพมหานคร', 'นครปฐม', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร',];
  //   const north = ['เชียงใหม่', 'เชียงราย', 'แพร่', 'แม่ฮ่องสอน', 'น่าน', 'พะเยา', 'ลำปาง', 'ลำพูน', 'อุตรดิตถ์',];
  //   const south = ['กระบี่', 'ชุมพร', 'ตรัง', 'นครศรีธรรมราช', 'นราธิวาส', 'ปัตตานี', 'พังงา', 'พัทลุง', 'ภูเก็ต', 'ยะลา', 'ระนอง', 'สงขลา', 'สตูล', 'สุราษฎร์ธานี',];
  //   const center = ['ชัยนาท', 'นครนายก', 'พระนครศรีอยุธยา', 'ลพบุรี', 'สมุทรสงคราม', 'สระบุรี', 'สิงห์บุรี', 'สุพรรณบุรี', 'อ่างทอง', 'เพชรบูรณ์', 'กำแพงเพชร', 'นครสวรรค์', 'พิจิตร', 'พิษณุโลก', 'สุโขทัย', 'อุทัยธานี',];
  //   const west = ['เพชรบุรี', 'กาญจนบุรี', 'ประจวบคีรีขันธ์', 'ราชบุรี', 'ตาก',];
  //   const east = ['จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ตราด', 'ปราจีนบุรี', 'ระยอง', 'สระแก้ว',];
  //   const northeast = ['เลย', 'กาฬสินธุ์', 'ขอนแก่น', 'ชัยภูมิ', 'นครพนม', 'นครราชสีมา', 'บึงกาฬ', 'บุรีรัมย์', 'มหาสารคาม', 'มุกดาหาร', 'ยโสธร', 'ร้อยเอ็ด', 'ศรีสะเกษ', 'สกลนคร', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อำนาจเจริญ', 'อุดรธานี', 'อุบลราชธานี'];

  //   if (bangkokother.includes(province)) return 'กรุงเทพมหานครและปริมณฑล';
  //   if (north.includes(province)) return 'ภาคเหนือ';
  //   if (south.includes(province)) return 'ภาคใต้';
  //   if (center.includes(province)) return 'ภาคกลาง';
  //   if (west.includes(province)) return 'ภาคตะวันตก';
  //   if (east.includes(province)) return 'ภาคตะวันออก';
  //   if (northeast.includes(province)) return 'ภาคตะวันออกเฉียงเหนือ';
  //   return 'ไม่ระบุ';
  // }

  // const renderFilter = () => {
  //   switch (selectFilter) {
  //     case 'region':
  //       return <>
  //         {
  //           regions?.map((region, rIndex) => (
  //             <Card
  //               key={`region-${rIndex}`}
  //               size="small"
  //             // style={{ marginBottom: 8, ...(course.isActivated && { borderColor: '#81B29A' }) }}
  //             >
  //               <Flex justify="">
  //                 <div>
  //                   <p>
  //                     <Text strong>{region.name}</Text>
  //                   </p>
  //                 </div>
  //               </Flex>
  //               <Collapse
  //                 key={`collapse-${rIndex}`}
  //                 ghost
  //                 expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
  //                 expandIconPosition="start"
  //                 items={[{
  //                   styles: { header: { padding: '0px 0px 0px' } },
  //                   key: `collapse-${rIndex}`,
  //                   label: <Text strong>รายชื่อจังหวัด</Text>,
  //                   children: <Table
  //                     pagination={false}
  //                     columns={[
  //                       { title: 'สถาบัน', dataIndex: 'instituteName' },
  //                       { title: 'จังหวัด', dataIndex: 'province' },
  //                       { title: 'อำเภอ', dataIndex: 'district' },
  //                       { title: 'สังกัด', dataIndex: 'department' },
  //                     ]}
  //                     dataSource={region.institutes.map((institute, instituteIndex) => ({
  //                       key: `institute-${instituteIndex}-${institute.instituteName}`,
  //                       ...institute,
  //                     }))}
  //                   />
  //                 }]}
  //               />
  //             </Card>
  //           ))
  //         }
  //       </>
  //     case 'department':
  //       return <>department</>;
  //   }
  // }

  return (
    <>
      <Flex justify="" gap={'middle'}>
        {
          (['region', 'department'] as SelectFilter[]).map((select) => (
            <Button key={select} onClick={() => setSelectFilter(select)} style={filterStyle(select)}>{select === 'region' ? Label.REGION : Label.DEPARTMENT}</Button>
          ))
        }
      </Flex>
      {/* <pre>{JSON.stringify(departments, null, 2)}</pre> */}
      {/* {renderFilter()} */}
      {/* {
        institutes && <LongdoMap coordinates={institutes} />
      } */}
    </>
  )
}
