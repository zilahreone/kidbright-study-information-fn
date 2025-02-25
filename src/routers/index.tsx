import ElementComponent from "../core/Element";
import Course from "../pages/Course";
import CourseLanding from "../pages/CourseLanding";
import Management from "../pages/Manage";
import Profile from "../pages/Profile";
import { createBrowserRouter } from "react-router-dom";


enum RouterPath {
  HOME = '/',
  COURSE_LANDING = '/course-landing',
  PROFILE = '/profile',
  COURSE = '/course',
  MANAGE = '/management',
}

const Element = {
  HOME: <>HOME</>,
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
  {
    path: RouterPath.MANAGE,
    element: <ElementComponent>
      {Element.MANAGE}
    </ElementComponent>,
  },
], {
  future: {
    v7_relativeSplatPath: true
  }
});
export default router