import ElementComponent from "../core/Element";
import CourseLanding from "../pages/CourseLanding";
import Profile from "../pages/Profile";
import Management from "../pages/Management";
import { createBrowserRouter } from "react-router-dom";


enum RouterPath {
  HOME = '/',
  COUSE_LANDING = '/course-landing',
  PROFILE = '/profile',
  COURSE = '/course',
  MANAGE = '/management',
}

const Element = {
  HOME: <>HOME</>,
  COUSE_LANDING: <CourseLanding />,
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
    path: RouterPath.COUSE_LANDING,
    element: <ElementComponent hasHeader={false} hasFooter={false}>
      {Element.COUSE_LANDING}
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