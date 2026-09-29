import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { AuthProvider } from './features/AdminAuth/model/AuthProvider.tsx'
import { store } from './app/providers/store/store';
import { Provider } from "react-redux";
import './app/styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
