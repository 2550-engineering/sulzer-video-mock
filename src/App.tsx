import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { DemoControls } from './components/DemoControls'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { placeholderRoutes } from './config/placeholderRoutes'
import { ApplicationPage } from './pages/ApplicationPage'
import { AssetPage } from './pages/AssetPage'
import { AssetsPage } from './pages/AssetsPage'
import { ConnectAlertsPage } from './pages/ConnectAlertsPage'
import { ConnectAssetPage } from './pages/ConnectAssetPage'
import { ConnectAssetsPage } from './pages/ConnectAssetsPage'
import { ConnectDashboardPage } from './pages/ConnectDashboardPage'
import { ConnectLayout } from './pages/ConnectLayout'
import { ConnectPage } from './pages/ConnectPage'
import { ConnectReportsPage } from './pages/ConnectReportsPage'
import { ConnectUsersPage } from './pages/ConnectUsersPage'
import { DigitalSolutionsPage } from './pages/DigitalSolutionsPage'
import { HomePage } from './pages/HomePage'
import { MyPagesPage } from './pages/MyPagesPage'
import { MyProjectsPage } from './pages/MyProjectsPage'
import { MySulzerPage } from './pages/MySulzerPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProductPage } from './pages/ProductPage'
import { ProductSearchPage } from './pages/ProductSearchPage'
import { RecentlyViewedPage } from './pages/RecentlyViewedPage'
import { SavedItemsPage } from './pages/SavedItemsPage'
import { SizingPage } from './pages/SizingPage'
import { SizingResultsPage } from './pages/SizingResultsPage'
import { PersonalProvider } from './personal/PersonalProvider'
import { ProjectsProvider } from './projects/ProjectsProvider'
import { ToastProvider } from './toast/ToastProvider'

export default function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <PersonalProvider>
          <BrowserRouter>
            <ToastProvider>
              <ScrollToTop />
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/my-sulzer" element={<MySulzerPage />} />
                  <Route path="/my-pages" element={<MyPagesPage />} />
                  <Route path="/my-pages/saved" element={<SavedItemsPage />} />
                  <Route path="/my-pages/recently-viewed" element={<RecentlyViewedPage />} />
                  <Route path="/applications" element={<ApplicationPage />} />
                  <Route path="/applications/:areaSlug" element={<ApplicationPage />} />
                  <Route path="/applications/:areaSlug/:appSlug" element={<ApplicationPage />} />
                  <Route path="/products" element={<ProductSearchPage />} />
                  {/* Products A–Z and Categories are the results page without a query; keeps old links working. */}
                  <Route path="/products/a-z" element={<Navigate to="/products" replace />} />
                  <Route
                    path="/products/categories"
                    element={<Navigate to="/products" replace />}
                  />
                  <Route path="/products/:id" element={<ProductPage />} />
                  <Route path="/digital-solutions" element={<DigitalSolutionsPage />} />
                  <Route path="/sizing" element={<SizingPage />} />
                  <Route path="/sizing/results" element={<SizingResultsPage />} />
                  <Route path="/my-projects" element={<MyProjectsPage />} />
                  <Route path="/my-projects/:projectId" element={<MyProjectsPage />} />
                  <Route path="/assets" element={<AssetsPage />} />
                  <Route path="/assets/:id" element={<AssetPage />} />
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
                <Route path="/connect" element={<ConnectLayout />}>
                  <Route index element={<ConnectPage />} />
                  <Route path="dashboard" element={<ConnectDashboardPage />} />
                  <Route path="assets" element={<ConnectAssetsPage />} />
                  <Route path="assets/:id" element={<ConnectAssetPage />} />
                  <Route path="alerts" element={<ConnectAlertsPage />} />
                  <Route path="reports" element={<ConnectReportsPage />} />
                  <Route path="users" element={<ConnectUsersPage view="users" />} />
                  <Route path="teams" element={<ConnectUsersPage view="teams" />} />
                  <Route path="*" element={<Navigate to="/connect/dashboard" replace />} />
                </Route>
              </Routes>
            </ToastProvider>
            <DemoControls />
          </BrowserRouter>
        </PersonalProvider>
      </ProjectsProvider>
    </AuthProvider>
  )
}
