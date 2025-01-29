import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { ConfigProvider, theme } from 'antd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        fontFamily: 'IBM Plex Sans Thai',
        fontSize: 16,
        fontWeightStrong: 600,
      },
    }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
