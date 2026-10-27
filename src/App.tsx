import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { SiteLayout } from './components/SiteLayout'
import { placeholderRoutes } from './config/placeholderRoutes'
import { HomePage } from './pages/HomePage'
import { MySulzerPage } from './pages/MySulzerPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-sulzer" element={<MySulzerPage />} />
            {placeholderRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PlaceholderPage route={route} />}
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
