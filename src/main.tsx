import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { AuthProvider } from './features/AdminAuth/model/AuthProvider.tsx'
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/providers/store/store';
import { Provider } from "react-redux";
import './app/styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <App />
      </AuthProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
