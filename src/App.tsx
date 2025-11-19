import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminVendorsPage from "./pages/admin/AdminVendorsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AccountDashboardPage from "./pages/account/AccountDashboardPage";
import OrdersPage from "./pages/account/OrdersPage";
import AddressesPage from "./pages/account/AddressesPage";
import VendorOnboardingPage from "./pages/vendor/VendorOnboardingPage";
import VendorDashboardPage from "./pages/vendor/VendorDashboardPage";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import { ProductAlertsProvider } from "./context/ProductAlertsContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import RequireAuth from "./components/RequireAuth";
import ComparisonPage from "./pages/ComparisonPage";
import VendorProductsPage from "./pages/vendor/VendorProductsPage";
import VendorOrdersPage from "./pages/vendor/VendorOrdersPage";
import VendorProfilePage from "./pages/vendor/VendorProfilePage";
import VendorAnalyticsPage from "./pages/vendor/VendorAnalyticsPage";
import BulkUploadPage from "./pages/vendor/BulkUploadPage";
import PromotionsPage from "./pages/vendor/PromotionsPage";
import VendorEarningsPage from "./pages/vendor/VendorEarningsPage";
import VendorPayoutsPage from "./pages/vendor/VendorPayoutsPage";
import VendorStorefrontPage from "./pages/vendor/VendorStorefrontPage";
import OrderTrackingPage from "./pages/account/OrderTrackingPage";
import SubscriptionsPage from "./pages/account/SubscriptionsPage";
import PreOrdersPage from "./pages/account/PreOrdersPage";
import SupportTicketsPage from "./pages/account/SupportTicketsPage";
import ReturnsPage from "./pages/account/ReturnsPage";
import PaymentMethodsPage from "./pages/account/PaymentMethodsPage";
import DigitalWalletPage from "./pages/account/DigitalWalletPage";
import PreferencesPage from "./pages/account/PreferencesPage";
import LoyaltyPage from "./pages/account/LoyaltyPage";
import NotificationsPage from "./pages/account/NotificationsPage";
import VendorMessagesPage from "./pages/vendor/VendorMessagesPage";
import VendorPerformancePage from "./pages/vendor/VendorPerformancePage";
import VendorProductTemplatesPage from "./pages/vendor/VendorProductTemplatesPage";
import FollowingPage from "./pages/account/FollowingPage";
import StyleQuizPage from "./pages/account/StyleQuizPage";
import VendorProductSchedulingPage from "./pages/vendor/VendorProductSchedulingPage";
import AdminProductApprovalPage from "./pages/admin/AdminProductApprovalPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import MyReviewsPage from "./pages/account/MyReviewsPage";
import ReferralsPage from "./pages/account/ReferralsPage";
import VendorShippingPage from "./pages/vendor/VendorShippingPage";
import VendorReturnsPage from "./pages/vendor/VendorReturnsPage";
import HelpCenterPage from "./pages/support/HelpCenterPage";
import CustomerInsightsPage from "./pages/account/CustomerInsightsPage";
import LiveChatWidget from "./components/LiveChatWidget";
import VendorEmailCampaignsPage from "./pages/vendor/VendorEmailCampaignsPage";
import VendorSocialMediaPage from "./pages/vendor/VendorSocialMediaPage";
import AdminAdvancedAnalyticsPage from "./pages/admin/AdminAdvancedAnalyticsPage";
import AchievementsPage from "./pages/account/AchievementsPage";
import AdminMarketingAutomationPage from "./pages/admin/AdminMarketingAutomationPage";
import AdminDisputesPage from "./pages/admin/AdminDisputesPage";
import GiftRegistryPage from "./pages/account/GiftRegistryPage";
import AdminAPIManagementPage from "./pages/admin/AdminAPIManagementPage";
import StyleBoardsPage from "./pages/account/StyleBoardsPage";
import SecuritySettingsPage from "./pages/account/SecuritySettingsPage";
import PersonalizedHomePage from "./pages/PersonalizedHomePage";
import ActivityFeedPage from "./pages/social/ActivityFeedPage";
import UserProfilePage from "./pages/social/UserProfilePage";
import OutfitBuilderPage from "./pages/styling/OutfitBuilderPage";
import WardrobePlannerPage from "./pages/styling/WardrobePlannerPage";
import ColorAnalysisPage from "./pages/styling/ColorAnalysisPage";
import BodyTypeAnalysisPage from "./pages/styling/BodyTypeAnalysisPage";
import StyleConsultationPage from "./pages/styling/StyleConsultationPage";
import TrendingPage from "./pages/TrendingPage";
import SearchPage from "./pages/SearchPage";
import LiveShoppingPage from "./pages/live/LiveShoppingPage";
import LiveEventPage from "./pages/live/LiveEventPage";
import LiveAuctionPage from "./pages/live/LiveAuctionPage";
import ScheduledEventsPage from "./pages/live/ScheduledEventsPage";
import SustainabilityPage from "./pages/sustainability/SustainabilityPage";
import CarbonFootprintPage from "./pages/sustainability/CarbonFootprintPage";
import ARTryOnPage from "./pages/ar/ARTryOnPage";
import ARFurniturePage from "./pages/ar/ARFurniturePage";
import ARMakeupPage from "./pages/ar/ARMakeupPage";
import VirtualShowroomPage from "./pages/vr/VirtualShowroomPage";
import VRShoppingPage from "./pages/vr/VRShoppingPage";
import APIDocumentationPage from "./pages/api/APIDocumentationPage";
import APIKeysPage from "./pages/api/APIKeysPage";
import WebhooksPage from "./pages/api/WebhooksPage";
import IntegrationsPage from "./pages/api/IntegrationsPage";

const queryClient = new QueryClient();

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LiveChatWidget />
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <RecentlyViewedProvider>
                  <NotificationsProvider>
                    <ProductAlertsProvider>
                      <CurrencyProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Index />
                  </MainLayout>
                }
              />
              <Route
                path="/personalized"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <PersonalizedHomePage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/products"
                element={
                  <MainLayout>
                    <ProductsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <MainLayout>
                    <ProductDetailPage />
                  </MainLayout>
                }
              />
              <Route
                path="/search"
                element={
                  <MainLayout>
                    <SearchPage />
                  </MainLayout>
                }
              />
              <Route
                path="/trending"
                element={
                  <MainLayout>
                    <TrendingPage />
                  </MainLayout>
                }
              />
              <Route
                path="/live"
                element={
                  <MainLayout>
                    <LiveShoppingPage />
                  </MainLayout>
                }
              />
              <Route
                path="/live/:eventId"
                element={
                  <MainLayout>
                    <LiveEventPage />
                  </MainLayout>
                }
              />
              <Route
                path="/live/auction/:auctionId"
                element={
                  <MainLayout>
                    <LiveAuctionPage />
                  </MainLayout>
                }
              />
              <Route
                path="/live/schedule"
                element={
                  <MainLayout>
                    <ScheduledEventsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/sustainability"
                element={
                  <MainLayout>
                    <SustainabilityPage />
                  </MainLayout>
                }
              />
              <Route
                path="/sustainability/carbon-footprint"
                element={
                  <MainLayout>
                    <CarbonFootprintPage />
                  </MainLayout>
                }
              />
              <Route
                path="/ar/try-on/:productId?"
                element={
                  <MainLayout>
                    <ARTryOnPage />
                  </MainLayout>
                }
              />
              <Route
                path="/ar/furniture/:productId?"
                element={
                  <MainLayout>
                    <ARFurniturePage />
                  </MainLayout>
                }
              />
              <Route
                path="/ar/makeup/:productId?"
                element={
                  <MainLayout>
                    <ARMakeupPage />
                  </MainLayout>
                }
              />
              <Route
                path="/vr/showroom"
                element={
                  <MainLayout>
                    <VirtualShowroomPage />
                  </MainLayout>
                }
              />
              <Route
                path="/vr/shopping"
                element={
                  <MainLayout>
                    <VRShoppingPage />
                  </MainLayout>
                }
              />
              <Route
                path="/api/docs"
                element={
                  <MainLayout>
                    <APIDocumentationPage />
                  </MainLayout>
                }
              />
              <Route
                path="/api/keys"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <APIKeysPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/api/webhooks"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <WebhooksPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/api/integrations"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <IntegrationsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/categories"
                element={
                  <MainLayout>
                    <CategoriesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <MainLayout>
                    <AboutPage />
                  </MainLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <MainLayout>
                    <ContactPage />
                  </MainLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <MainLayout>
                    <CartPage />
                  </MainLayout>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <MainLayout>
                    <WishlistPage />
                  </MainLayout>
                }
              />
              <Route
                path="/compare"
                element={
                  <MainLayout>
                    <ComparisonPage />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <MainLayout>
                    <CheckoutPage />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout/success"
                element={
                  <MainLayout>
                    <CheckoutSuccessPage />
                  </MainLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <MainLayout>
                    <LoginPage />
                  </MainLayout>
                }
              />
              <Route
                path="/signup"
                element={
                  <MainLayout>
                    <SignupPage />
                  </MainLayout>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <MainLayout>
                    <ForgotPasswordPage />
                  </MainLayout>
                }
              />
              <Route
                path="/account"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <AccountDashboardPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/orders"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <OrdersPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/addresses"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <AddressesPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/subscriptions"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <SubscriptionsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/pre-orders"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <PreOrdersPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/support"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <SupportTicketsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/returns"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <ReturnsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/payment-methods"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <PaymentMethodsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/wallet"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <DigitalWalletPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/preferences"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <PreferencesPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/security"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <SecuritySettingsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/loyalty"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <LoyaltyPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/notifications"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <NotificationsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/following"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <FollowingPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/style-quiz"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <StyleQuizPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/reviews"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <MyReviewsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/referrals"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <ReferralsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/insights"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <CustomerInsightsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/achievements"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <AchievementsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/gift-registry"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <GiftRegistryPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/account/style-boards"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <StyleBoardsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/styling/outfit-builder"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <OutfitBuilderPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/styling/wardrobe-planner"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <WardrobePlannerPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/styling/color-analysis"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <ColorAnalysisPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/styling/body-type"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <BodyTypeAnalysisPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/styling/consultation"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <StyleConsultationPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/social/feed"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <ActivityFeedPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <MainLayout>
                    <UserProfilePage />
                  </MainLayout>
                }
              />
              <Route
                path="/support/help"
                element={
                  <MainLayout>
                    <HelpCenterPage />
                  </MainLayout>
                }
              />
              <Route
                path="/account/orders/:orderId/track"
                element={
                  <MainLayout>
                    <RequireAuth>
                      <OrderTrackingPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/apply"
                element={
                  <MainLayout>
                    <VendorOnboardingPage />
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/dashboard"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorDashboardPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/products"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorProductsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/orders"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorOrdersPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/:vendorId"
                element={
                  <MainLayout>
                    <VendorProfilePage />
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/analytics"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorAnalyticsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/bulk-upload"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <BulkUploadPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/promotions"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <PromotionsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/earnings"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorEarningsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/payouts"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorPayoutsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/storefront"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorStorefrontPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/messages"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorMessagesPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/performance"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorPerformancePage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/templates"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorProductTemplatesPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/scheduling"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorProductSchedulingPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/shipping"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorShippingPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/returns"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorReturnsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/email-campaigns"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorEmailCampaignsPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/vendor/social-media"
                element={
                  <MainLayout>
                    <RequireAuth allowedRoles={["vendor", "admin"]}>
                      <VendorSocialMediaPage />
                    </RequireAuth>
                  </MainLayout>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="vendors" element={<AdminVendorsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="product-approval" element={<AdminProductApprovalPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="advanced-analytics" element={<AdminAdvancedAnalyticsPage />} />
                <Route path="marketing-automation" element={<AdminMarketingAutomationPage />} />
                <Route path="disputes" element={<AdminDisputesPage />} />
                <Route path="api" element={<AdminAPIManagementPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
                      </CurrencyProvider>
                    </ProductAlertsProvider>
                  </NotificationsProvider>
                </RecentlyViewedProvider>
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </>
);

export default App;