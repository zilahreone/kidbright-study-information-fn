import ElementComponent from "../core/Element";
import CourseLanding from "../pages/CourseLanding";
import Profile from "../pages/Profile";
import { createBrowserRouter } from "react-router-dom";


enum RouterPath {
  HOME = '/',
  COUSE_LANDING = '/course-landing',
  PROFILE = '/profile',
  COURSE = '/course',
  MANAGE = '/manage',
}

const Element = {
  HOME: <>HOME</>,
  COUSE_LANDING: <CourseLanding />,
  PROFILE: <Profile />,
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
    element: <ElementComponent>
      {Element.COUSE_LANDING}
    </ElementComponent>
  },
  {
    path: RouterPath.PROFILE,
    element: <ElementComponent>
      {Element.PROFILE}
    </ElementComponent>,
  },
], {
  future: {
    v7_relativeSplatPath: true
  }
});
export default router