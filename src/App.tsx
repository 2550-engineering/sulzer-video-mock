import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { DemoControls } from './components/DemoControls'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { placeholderRoutes } from './config/placeholderRoutes'
import { ApplicationPage } from './pages/ApplicationPage'
import { AssetsPage } from './pages/AssetsPage'
import { ConnectPage } from './pages/ConnectPage'
import { HomePage } from './pages/HomePage'
import { MyPagesPage } from './pages/MyPagesPage'
import { MyProjectsPage } from './pages/MyProjectsPage'
import { MySulzerPage } from './pages/MySulzerPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProductPage } from './pages/ProductPage'
import { ProductSearchPage } from './pages/ProductSearchPage'
import { SizingPage } from './pages/SizingPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-sulzer" element={<MySulzerPage />} />
            <Route path="/my-pages" element={<MyPagesPage />} />
            <Route path="/applications" element={<ApplicationPage />} />
            <Route path="/applications/:slug" element={<ApplicationPage />} />
            <Route path="/products" element={<ProductSearchPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/sizing" element={<SizingPage />} />
            <Route path="/my-projects" element={<MyProjectsPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            {placeholderRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PlaceholderPage route={route} />}
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          {/* Sulzer Connect is its own app, outside the website header and footer. */}
          <Route path="/connect" element={<ConnectPage />} />
        </Routes>
        <DemoControls />
      </BrowserRouter>
    </AuthProvider>
  )
}
