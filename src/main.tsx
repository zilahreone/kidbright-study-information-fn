import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider, theme } from 'antd'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak.ts'
import { StrictMode } from 'react'
import AuthRole from './components/AuthRole.tsx'
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider
    // initOptions={{
    //   onLoad: 'login-required', // check-sso || login-required
    //   checkLoginIframe: false,
    // }}
    authClient={keycloak}
    LoadingComponent={<>Loading...</>}
    // onEvent={handeElvent}
    // onTokens={tokenLogger}
    // autoRefreshToken
  >
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        fontFamily: 'IBM Plex Sans Thai',
        fontSize: 16,
        fontWeightStrong: 600,
      },
    }}>
      <StrictMode>
      <AuthRole />
        {/* <AuthRole router={(r) => handleRouter(r)}>
          <RouterProvider router={router} future={{
            v7_startTransition: true,
          }} />
        </AuthRole> */}
      </StrictMode>
    </ConfigProvider>
  </ReactKeycloakProvider>
)
