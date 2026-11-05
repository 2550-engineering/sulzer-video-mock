import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { CartProvider } from './cart/CartProvider'
import { DemoControls } from './components/DemoControls'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { placeholderRoutes } from './config/placeholderRoutes'
import { ApplicationPage } from './pages/ApplicationPage'
import { AssetPage } from './pages/AssetPage'
import { AssetsPage } from './pages/AssetsPage'
import { BomPrintPage } from './pages/BomPrintPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfiguredProductPage } from './pages/ConfiguredProductPage'
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
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { OrderPage } from './pages/OrderPage'
import { OrdersPage } from './pages/OrdersPage'
import { PartnerCustomerPage } from './pages/PartnerCustomerPage'
import { PartnerCustomersPage } from './pages/PartnerCustomersPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProductPage } from './pages/ProductPage'
import { ProductSearchPage } from './pages/ProductSearchPage'
import { ProjectReportPage } from './pages/ProjectReportPage'
import { PumpReplacementPage } from './pages/PumpReplacementPage'
import { QuotationPage } from './pages/QuotationPage'
import { QuotationsPage } from './pages/QuotationsPage'
import { RecentlyViewedPage } from './pages/RecentlyViewedPage'
import { ReplacementPage } from './pages/ReplacementPage'
import { RequestsPage } from './pages/RequestsPage'
import { SavedItemsPage } from './pages/SavedItemsPage'
import { SizingComparePage } from './pages/SizingComparePage'
import { SizingPage } from './pages/SizingPage'
import { SizingResultsPage } from './pages/SizingResultsPage'
import { SparePartsPage } from './pages/SparePartsPage'
import { VariantPage } from './pages/VariantPage'
import { VariantPrintPage } from './pages/VariantPrintPage'
import { PersonalProvider } from './personal/PersonalProvider'
import { ProjectsProvider } from './projects/ProjectsProvider'
import { SelfServiceProvider } from './selfService/SelfServiceProvider'
import { ToastProvider } from './toast/ToastProvider'

export default function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <PersonalProvider>
          <SelfServiceProvider>
            <BrowserRouter>
              <ToastProvider>
                <CartProvider>
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
                      <Route
                        path="/applications/:areaSlug/:appSlug"
                        element={<ApplicationPage />}
                      />
                      <Route path="/products" element={<ProductSearchPage />} />
                      {/* Products A–Z and Categories are the results page without a query; keeps old links working. */}
                      <Route path="/products/replacement" element={<ReplacementPage />} />
                      {/* Replacing an installed pump (asset, serial number, type or other brand) with energy savings. */}
                      <Route
                        path="/products/replacement/existing-pump"
                        element={<PumpReplacementPage />}
                      />
                      <Route path="/products/a-z" element={<Navigate to="/products" replace />} />
                      <Route
                        path="/products/categories"
                        element={<Navigate to="/products" replace />}
                      />
                      <Route path="/products/:id" element={<ProductPage />} />
                      <Route path="/products/:id/:variantId" element={<VariantPage />} />
                      {/* A configured pump from sizing, rebuilt from its URL. */}
                      <Route
                        path="/products/:id/config/:variantId"
                        element={<ConfiguredProductPage />}
                      />
                      <Route path="/digital-solutions" element={<DigitalSolutionsPage />} />
                      <Route path="/sizing" element={<SizingPage />} />
                      <Route path="/sizing/results" element={<SizingResultsPage />} />
                      <Route path="/sizing/compare" element={<SizingComparePage />} />
                      <Route path="/spare-parts" element={<SparePartsPage />} />
                      <Route path="/my-projects" element={<MyProjectsPage />} />
                      <Route path="/my-projects/:projectId" element={<MyProjectsPage />} />
                      <Route path="/assets" element={<AssetsPage />} />
                      <Route path="/assets/:id" element={<AssetPage />} />
                      <Route path="/partner/customers" element={<PartnerCustomersPage />} />
                      <Route path="/partner/customers/:id" element={<PartnerCustomerPage />} />
                      <Route path="/self-service/requests" element={<RequestsPage />} />
                      <Route path="/self-service/orders" element={<OrdersPage />} />
                      <Route path="/self-service/orders/:id" element={<OrderPage />} />
                      <Route path="/self-service/quotations" element={<QuotationsPage />} />
                      <Route path="/self-service/quotations/:id" element={<QuotationPage />} />
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
                    <Route
                      path="/products/:id/config/:variantId/print"
                      element={<VariantPrintPage configured />}
                    />
                    <Route path="/my-projects/:projectId/report" element={<ProjectReportPage />} />
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
                </CartProvider>
              </ToastProvider>
              <DemoControls />
            </BrowserRouter>
          </SelfServiceProvider>
        </PersonalProvider>
      </ProjectsProvider>
    </AuthProvider>
  )
}