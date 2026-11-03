import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { CartProvider } from './cart/CartProvider'
import { DemoControls } from './components/DemoControls'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { placeholderRoutes } from './config/placeholderRoutes'
import { ApplicationPage } from './pages/ApplicationPage'
import { AssetsPage } from './pages/AssetsPage'
import { BomPrintPage } from './pages/BomPrintPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConnectPage } from './pages/ConnectPage'
import { HomePage } from './pages/HomePage'
import { MyPagesPage } from './pages/MyPagesPage'
import { MyProjectsPage } from './pages/MyProjectsPage'
import { MySulzerPage } from './pages/MySulzerPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProductPage } from './pages/ProductPage'
import { ProductSearchPage } from './pages/ProductSearchPage'
import { ReplacementPage } from './pages/ReplacementPage'
import { SizingComparePage } from './pages/SizingComparePage'
import { SizingPage } from './pages/SizingPage'
import { SparePartsPage } from './pages/SparePartsPage'
import { SizingResultsPage } from './pages/SizingResultsPage'
import { VariantPage } from './pages/VariantPage'
import { ProjectReportPage } from './pages/ProjectReportPage'
import { VariantPrintPage } from './pages/VariantPrintPage'
import { ProjectsProvider } from './projects/ProjectsProvider'
import { ToastProvider } from './toast/ToastProvider'

export default function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <BrowserRouter>
          <ToastProvider>
            <CartProvider>
              <ScrollToTop />
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/my-sulzer" element={<MySulzerPage />} />
                  <Route path="/my-pages" element={<MyPagesPage />} />
                  <Route path="/applications" element={<ApplicationPage />} />
                  <Route path="/applications/:areaSlug" element={<ApplicationPage />} />
                  <Route path="/applications/:areaSlug/:appSlug" element={<ApplicationPage />} />
                  <Route path="/products" element={<ProductSearchPage />} />
                  {/* Products A–Z and Categories are the results page without a query; keeps old links working. */}
                  <Route path="/products/replacement" element={<ReplacementPage />} />
                  <Route path="/products/a-z" element={<Navigate to="/products" replace />} />
                  <Route
                    path="/products/categories"
                    element={<Navigate to="/products" replace />}
                  />
                  <Route path="/products/:id" element={<ProductPage />} />
                  <Route path="/products/:id/:variantId" element={<VariantPage />} />
                  <Route path="/sizing" element={<SizingPage />} />
                  <Route path="/sizing/results" element={<SizingResultsPage />} />
                  <Route path="/sizing/compare" element={<SizingComparePage />} />
                  <Route path="/spare-parts" element={<SparePartsPage />} />
                  <Route path="/my-projects" element={<MyProjectsPage />} />
                  <Route path="/my-projects/:projectId" element={<MyProjectsPage />} />
                  <Route path="/assets" element={<AssetsPage />} />
                  <Route path="/eshop" element={<Navigate to="/eshop/cart" replace />} />
                  <Route path="/eshop/cart" element={<CartPage />} />
                  <Route path="/eshop/checkout" element={<CheckoutPage />} />
                  <Route path="/eshop/order/:orderId" element={<OrderConfirmationPage />} />
                  {placeholderRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={<PlaceholderPage route={route} />}
                    />
                  ))}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                {/* A clean print view of a configured product, without the site header and footer. */}
                <Route path="/products/:id/:variantId/print" element={<VariantPrintPage />} />
                <Route path="/products/:id/:variantId/bom" element={<BomPrintPage />} />
                <Route path="/my-projects/:projectId/report" element={<ProjectReportPage />} />
                {/* Sulzer Connect is its own app, outside the website header and footer. */}
                <Route path="/connect" element={<ConnectPage />} />
              </Routes>
            </CartProvider>
          </ToastProvider>
          <DemoControls />
        </BrowserRouter>
      </ProjectsProvider>
    </AuthProvider>
  )
}
