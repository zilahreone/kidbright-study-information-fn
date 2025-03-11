import { Flex } from "antd";
import { NavLink } from "react-router-dom";

export default function Navbar() {

  enum RouterPath {
    HOME = '/',
    PROFILE = '/profile',
    COURSE = '/course',
    MANAGE = '/management',
  }

  type NavObject = {
    name: string,
    path: string
  }

  type Nav = {
    home: NavObject,
    course?: NavObject,
    profile: NavObject,
    manage?: NavObject
  }

  const navObj: Nav = {
    home: { name: 'Home', path: RouterPath.HOME },
    course: { name: 'Course', path: RouterPath.COURSE },
    profile: { name: 'Profile', path: RouterPath.PROFILE },
    manage: { name: 'Manage', path: RouterPath.MANAGE }
  }

  // const items: MenuProps['items'] = [
  //   {
  //     key: '1',
  //     label: (
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
  //         1st menu item
  //       </a>
  //     ),
  //   },
  //   // {
  //   //   key: '2',
  //   //   label: (
  //   //     <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
  //   //       2nd menu item (disabled)
  //   //     </a>
  //   //   ),
  //   //   icon: <SmileOutlined />,
  //   //   disabled: true,
  //   // },
  //   {
  //     key: '3',
  //     label: (
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
  //         3rd menu item (disabled)
  //       </a>
  //     ),
  //     disabled: true,
  //   },
  //   {
  //     key: '4',
  //     danger: true,
  //     label: 'a danger item',
  //   },
  // ];
  return (
    <Flex justify="space-between" align="center">
      <img src="/logo-adap-green-untext.png" alt="kid-bright-logo" width={45} />
      <Flex gap={30}>
        {
          Object.entries(navObj).map(([key, value]) => (
            <NavLink
              key={key}
              to={value.path}
              style={({ isActive }) => {
                return isActive ? { color: "#E07A5F" } : { color: "#FFF" };
              }}
            // className={({ isActive, isPending, isTransitioning }) =>
            //   [
            //     isPending ? "pending" : "",
            //     isActive ? "red" : "text-black",
            //     isTransitioning ? "transitioning" : "",
            //   ].join(" ")
            // }
            >
              {value.name}
            </NavLink>
          ))
        }
      </Flex>
      <div></div>
      {/* <Dropdown menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Hover me
            <DownOutlined />
          </Space>
        </a>
      </Dropdown> */}
    </Flex>
  )
}
