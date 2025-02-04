// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { ConfigProvider, theme } from 'antd'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CourseLanding from './pages/CourseLanding.tsx'
import Profile from './pages/Profile.tsx'

// const eventLogger = (event: any, error: any) => {
//   // 'onReady' | 'onInitError' | 'onAuthSuccess' | 'onAuthError' | 'onAuthRefreshSuccess' | 'onAuthRefreshError' | 'onAuthLogout' | 'onTokenExpired'
//   // console.log('onKeycloakEvent', event, error)
//   // console.log(event, error)
//   // const { name, email, given_name, family_name, preferred_username, sub } = keycloak.tokenParsed
//   // const user = {
//   //   id: sub,
//   //   name,
//   //   preferredUsername: preferred_username,
//   //   givenName: given_name,
//   //   familyName: family_name,
//   //   email,
//   //   user: keycloak.tokenParsed
//   // }
//   switch (event) {
//     case 'onAuthSuccess':
//       console.log('onAuthSuccess');
//       // setAuthenthicated(true)
//       // setCredential(keycloak.token)
//       // console.log(keycloak.token);
//       // api.postJSON(`/api/user`, user, keycloak.token).then(resp => {
//       //   // console.log(resp.status);
//       //   if (resp.status === 201) {
//       //     // resp.json().then(json => {
//       //     //   console.log(json);
//       //     //   // resp.status === 200 ? setSamplesData(json) : setSamplesData([])
//       //     // })
//       //   }
//       // })
//       break;
//     case 'onAuthLogout':
//       console.log('logout');
//       // setAuthenthicated(false)
//       break;
//     case 'onAuthRefreshSuccess':
//       console.log('refresh');
//       // setAuthenthicated(true)
//       // console.log(keycloak.token);
//       break;
//     case 'onTokenExpired':
//       console.log('expire');
//       // setAuthenthicated(false)
//       break;
//     case 'onReady':
//       console.log('ready');
//       break;
//     default:
//       break;
//   }
// }
// const tokenLogger = (tokens: any) => {
//   console.log(tokens)
//   // if (tokens) {
//   //   for (const key in tokens) {
//   //     // console.log(key);
//   //     console.log(jwtDecode(tokens[key]))
//   //   }
//   // }
// }

enum RouterPath {
  HOME = '/',
  COUSE_LANDING = '/course-landing',
  PROFILE = '/profile',
  COURSE = '/course',
  MANAGE = '/manage',
}

const Element = {
  HOME: <></>,
  COUSE_LANDING: <CourseLanding />,
  PROFILE: <Profile />,
}

const router = createBrowserRouter([
  {
    path: RouterPath.HOME,
    element: Element.HOME,
  },
  {
    path: RouterPath.COUSE_LANDING,
    element: Element.COUSE_LANDING,
  },
  {
    path: RouterPath.PROFILE,
    element: Element.PROFILE,
  },
], {
  future: {
    v7_relativeSplatPath: true
  }
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ReactKeycloakProvider
    initOptions={{
      onLoad: 'login-required', // check-sso || login-required
      checkLoginIframe: false,
    }}
    authClient={keycloak}
    LoadingComponent={<>Loading...</>}
    // onEvent={eventLogger}
    // onTokens={tokenLogger}
    autoRefreshToken
  >
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        fontFamily: 'IBM Plex Sans Thai',
        fontSize: 16,
        fontWeightStrong: 600,
      },
    }}>
      <RouterProvider router={router} future={{
        v7_startTransition: true,
      }} />
    </ConfigProvider>
  </ReactKeycloakProvider>
  // </StrictMode>,
)
