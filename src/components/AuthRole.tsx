import { useEffect, useState } from "react";
import { fetchAPI } from "../utils";
import { useKeycloak } from "@react-keycloak/web";
import useStore from "../utils/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Course from "../pages/Course";
import CourseLanding from "../pages/CourseLanding";
import Profile from "../pages/Profile";
import Management from "../pages/Manage";
import ElementComponent from "../core/Element";

export default function AuthRole() {
  const { setRole, setUserId, isRole } = useStore();
  const { keycloak } = useKeycloak();
  const [hasFetch, setHasFetch] = useState<boolean>(false);

  enum RouterPath {
    HOME = '/',
    COURSE_LANDING = '/course-landing',
    PROFILE = '/profile',
    COURSE = '/course',
    MANAGE = '/management',
  }

  const Element = {
    // HOME: <Home2 />,
    HOME: <Home />,
    COURSE: <Course />,
    COURSE_LANDING: <CourseLanding />,
    PROFILE: <Profile />,
    MANAGE: <Management />
  }

  const router = createBrowserRouter([
    {
      path: RouterPath.HOME,
      element: <ElementComponent>
        {Element.HOME}
      </ElementComponent>
    },
    {
      path: RouterPath.COURSE,
      element: <ElementComponent>
        {Element.COURSE}
      </ElementComponent>
    },
    {
      path: RouterPath.COURSE_LANDING,
      element: <ElementComponent hasHeader={false} hasFooter={false}>
        {Element.COURSE_LANDING}
      </ElementComponent>
    },
    {
      path: RouterPath.PROFILE,
      element: <ElementComponent>
        {Element.PROFILE}
      </ElementComponent>,
    },
    (isRole === 'admin' ?
      {
        path: RouterPath.MANAGE,
        element: <ElementComponent>
          {Element.MANAGE}
        </ElementComponent>,
      } : {}
    )
  ], {
    future: {
      v7_relativeSplatPath: true
    }
  })

  useEffect(() => {
    fetchAPI('GET', `${process.env.BASEURL}/api/kidbright/user/${keycloak.tokenParsed?.sub}`, keycloak.token).then((res) => {
      // console.log(res);
      setRole(res.role);
      setUserId(res.userId);
      setHasFetch(true);
    }).catch(() => setHasFetch(true));
  }, [])

  return (
    hasFetch && <RouterProvider router={router} future={{
      v7_startTransition: true,
    }} />
  )
}