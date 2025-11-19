# Implementation Guide: Components, Screens & Flows

> **Purpose**: Comprehensive breakdown of all UI components, screens, and user flows needed to implement the feature roadmap.

---

## Progress Tracker

- [x] Authentication foundation (AuthProvider, Login, Signup, Forgot Password)
- [x] Core browsing experience (Home, Categories, Products, Product Detail)
- [x] Cart + Checkout flow (cart, checkout, success)
- [x] Account dashboard shell
- [x] Vendor onboarding intake form
- [x] Admin CRUD surfaces (products, categories, orders)
- [x] Wishlist foundation + dedicated page
- [x] Vendor dashboard workspace (metrics, inventory alerts)
- [x] Advanced catalog filters (price slider, in-stock filter)
- [x] Global currency selector with formatted pricing
- [ ] Advanced discovery, personalization, and AI layers
- [ ] Mobile-native enhancements, AR/VR, blockchain, sustainability

---

## Table of Contents

1. [Reusable UI Components](#reusable-ui-components)
2. [Page/Screen Components](#pagescreen-components)
3. [User Flows](#user-flows)
4. [Vendor Flows](#vendor-flows)
5. [Admin Flows](#admin-flows)
6. [Mobile-Specific Components](#mobile-specific-components)
7. [Shared/Common Components](#sharedcommon-components)
8. [Modals & Dialogs](#modals--dialogs)
9. [Forms & Inputs](#forms--inputs)
10. [Data Display Components](#data-display-components)
11. [Navigation Components](#navigation-components)
12. [Feature-Specific Components](#feature-specific-components)

---

## Reusable UI Components

### Authentication Components
- `AuthButton.tsx` - Social login buttons (Google, Apple, Facebook, etc.)
- `LoginForm.tsx` - Email/password login form
- `SignupForm.tsx` - Registration form with validation
- `ForgotPasswordForm.tsx` - Password reset request form
- `ResetPasswordForm.tsx` - New password entry form
- `MFAForm.tsx` - Multi-factor authentication input
- `BiometricAuthButton.tsx` - Face ID/Touch ID button
- `OTPInput.tsx` - One-time password input component
- `SocialLoginButtons.tsx` - Social media login buttons group
- `AccountVerificationBadge.tsx` - Verification status badge
- `KYCDocumentUpload.tsx` - KYC document upload component
- `SSOButton.tsx` - Single sign-on button

### Product Display Components
- `ProductCard.tsx` - Basic product card with image, title, price
- `ProductCardLuxury.tsx` - Enhanced luxury product card
- `ProductImage.tsx` - Product image with zoom, lazy loading
- `ProductImage360.tsx` - 360-degree product viewer
- `ProductVideo.tsx` - Embedded product video player
- `ProductGallery.tsx` - Image gallery with thumbnails
- `ProductZoom.tsx` - Zoom functionality for product images
- `ProductBadge.tsx` - Badges (New, Sale, Limited Edition, etc.)
- `ProductPrice.tsx` - Price display with currency conversion
- `ProductRating.tsx` - Star rating display and input
- `ProductVariants.tsx` - Size, color, material selector
- `ProductComparisonCard.tsx` - Product comparison view
- `ProductBundleCard.tsx` - Bundle product display
- `ProductQuickView.tsx` - Quick view modal (already exists, enhance)
- `ProductAuthenticityBadge.tsx` - Blockchain/NFC verification badge
- `ProductCertificate.tsx` - Certificate of authenticity display
- `ProductProvenance.tsx` - Ownership history timeline

### Search & Filter Components
- `SearchBar.tsx` - Main search input with autocomplete
- `VoiceSearchButton.tsx` - Voice search trigger
- `VisualSearchButton.tsx` - Image upload for visual search
- `SearchFilters.tsx` - Filter sidebar/panel
- `FilterGroup.tsx` - Collapsible filter group
- `PriceRangeSlider.tsx` - Price range filter
- `ColorFilter.tsx` - Color swatch filter
- `SizeFilter.tsx` - Size selector filter
- `BrandFilter.tsx` - Brand checkbox filter
- `CategoryFilter.tsx` - Category tree filter
- `MaterialFilter.tsx` - Material type filter
- `RatingFilter.tsx` - Minimum rating filter
- `AvailabilityFilter.tsx` - In stock/out of stock filter
- `SortDropdown.tsx` - Sort options dropdown
- `SearchResults.tsx` - Search results list/grid
- `SearchSuggestions.tsx` - Autocomplete suggestions dropdown
- `RecentSearches.tsx` - Recent search history
- `SavedSearches.tsx` - Saved search queries

### Cart & Checkout Components
- `CartItem.tsx` - Individual cart item display
- `CartSummary.tsx` - Cart totals and summary
- `CartEmpty.tsx` - Empty cart state
- `SaveForLater.tsx` - Save item for later button
- `GiftOptions.tsx` - Gift wrapping and message options
- `ShippingAddressForm.tsx` - Address input form
- `BillingAddressForm.tsx` - Billing address form
- `ShippingMethodSelector.tsx` - Shipping options radio group
- `PaymentMethodSelector.tsx` - Payment method selection
- `PaymentForm.tsx` - Credit card/payment input form
- `BuyNowPayLater.tsx` - BNPL option display
- `OrderSummary.tsx` - Final order review
- `CheckoutProgress.tsx` - Multi-step checkout progress indicator
- `GuestCheckoutForm.tsx` - Guest checkout email capture
- `PromoCodeInput.tsx` - Discount code input
- `OneClickBuyButton.tsx` - One-click purchase button

### Wishlist Components
- `WishlistItem.tsx` - Wishlist item card
- `WishlistGrid.tsx` - Wishlist items grid
- `WishlistSelector.tsx` - Select which wishlist to add to
- `CreateWishlistDialog.tsx` - Create new wishlist modal
- `ShareWishlistButton.tsx` - Share wishlist functionality
- `WishlistPrivacyToggle.tsx` - Public/private wishlist toggle
- `GiftRegistryItem.tsx` - Gift registry specific item
- `WishlistCollaboration.tsx` - Collaborative wishlist features

### User Profile Components
- `UserAvatar.tsx` - User profile picture
- `UserProfileHeader.tsx` - Profile header with stats
- `UserBadges.tsx` - User achievement badges
- `VIPStatusBadge.tsx` - VIP tier display
- `MembershipCard.tsx` - Digital membership card
- `ProfileTabs.tsx` - Profile navigation tabs
- `AccountSettings.tsx` - Account settings form
- `PrivacySettings.tsx` - Privacy preferences
- `NotificationSettings.tsx` - Notification preferences
- `PaymentMethodsList.tsx` - Saved payment methods
- `AddressBook.tsx` - Saved addresses list
- `OrderHistory.tsx` - Past orders list
- `StyleProfile.tsx` - User style preferences
- `SizeProfile.tsx` - Saved sizes for different categories

### Vendor Components
- `VendorCard.tsx` - Vendor storefront card
- `VendorHeader.tsx` - Vendor page header
- `VendorBadge.tsx` - Verified/Premium vendor badge
- `VendorRating.tsx` - Vendor rating display
- `VendorProducts.tsx` - Vendor's products grid
- `VendorReviews.tsx` - Vendor reviews list
- `VendorFollowButton.tsx` - Follow/unfollow vendor
- `VendorStats.tsx` - Vendor statistics display
- `VendorVerificationBadge.tsx` - Verification status

### Review & Rating Components
- `ReviewCard.tsx` - Individual review display
- `ReviewForm.tsx` - Write review form
- `ReviewFilters.tsx` - Filter reviews (rating, verified, etc.)
- `ReviewHelpfulButton.tsx` - Helpful/not helpful voting
- `ReviewImages.tsx` - Review photo gallery
- `ReviewVideo.tsx` - Video review player
- `RatingDistribution.tsx` - Rating breakdown chart
- `VerifiedPurchaseBadge.tsx` - Verified purchase indicator

### Notification Components
- `NotificationBell.tsx` - Notification icon with badge
- `NotificationDropdown.tsx` - Notification dropdown menu
- `NotificationItem.tsx` - Individual notification
- `NotificationSettings.tsx` - Notification preferences
- `PushNotificationPrompt.tsx` - Request push notification permission
- `ToastNotification.tsx` - Toast notification component
- `InAppNotification.tsx` - In-app notification banner

### Loading & Empty States
- `LoadingSpinner.tsx` - Loading spinner
- `SkeletonLoader.tsx` - Skeleton loading state
- `EmptyState.tsx` - Empty state with message and CTA
- `ErrorState.tsx` - Error state with retry button
- `NoResults.tsx` - No search results state
- `LoadingOverlay.tsx` - Full-page loading overlay

---

## Page/Screen Components

### Customer Pages

#### Authentication Pages
- `pages/auth/LoginPage.tsx` - Login page
- `pages/auth/SignupPage.tsx` - Registration page
- `pages/auth/ForgotPasswordPage.tsx` - Password reset request
- `pages/auth/ResetPasswordPage.tsx` - Password reset confirmation
- `pages/auth/VerifyEmailPage.tsx` - Email verification
- `pages/auth/VerifyPhonePage.tsx` - Phone verification
- `pages/auth/MFAPage.tsx` - Multi-factor authentication
- `pages/auth/KYCPage.tsx` - Know Your Customer verification

#### Home & Discovery Pages
- `pages/Index.tsx` - Homepage (exists, enhance)
- `pages/ProductsPage.tsx` - Product listing (exists, enhance)
- `pages/ProductDetailPage.tsx` - Product detail (exists, enhance)
- `pages/CategoriesPage.tsx` - Categories (exists, enhance)
- `pages/SearchPage.tsx` - Search results page
- `pages/TrendingPage.tsx` - Trending products
- `pages/NewArrivalsPage.tsx` - New arrivals feed
- `pages/ExclusiveDropsPage.tsx` - Limited edition drops
- `pages/ArchivePage.tsx` - Vintage/archive collection
- `pages/PreLaunchPage.tsx` - Pre-launch products
- `pages/CollectionsPage.tsx` - Curated collections
- `pages/BrandsPage.tsx` - All brands listing
- `pages/BrandDetailPage.tsx` - Individual brand page

#### Shopping Pages
- `pages/CartPage.tsx` - Shopping cart (exists, enhance)
- `pages/CheckoutPage.tsx` - Checkout process
- `pages/CheckoutSuccessPage.tsx` - Order confirmation
- `pages/WishlistPage.tsx` - User wishlist
- `pages/WishlistsPage.tsx` - Multiple wishlists management
- `pages/GiftRegistryPage.tsx` - Gift registry
- `pages/ComparisonPage.tsx` - Product comparison
- `pages/QuickViewPage.tsx` - Quick view modal page

#### User Account Pages
- `pages/account/DashboardPage.tsx` - Account dashboard
- `pages/account/ProfilePage.tsx` - User profile
- `pages/account/OrdersPage.tsx` - Order history
- `pages/account/OrderDetailPage.tsx` - Individual order details
- `pages/account/AddressesPage.tsx` - Address book
- `pages/account/PaymentMethodsPage.tsx` - Payment methods
- `pages/account/SettingsPage.tsx` - Account settings
- `pages/account/PrivacyPage.tsx` - Privacy settings
- `pages/account/NotificationsPage.tsx` - Notification preferences
- `pages/account/SecurityPage.tsx` - Security settings
- `pages/account/ActivityPage.tsx` - Account activity log

#### VIP & Concierge Pages
- `pages/vip/MembershipPage.tsx` - VIP membership info
- `pages/vip/ConciergePage.tsx` - Concierge service booking
- `pages/vip/PersonalShopperPage.tsx` - Personal shopper booking
- `pages/vip/StylistPage.tsx` - Personal stylist service
- `pages/vip/WardrobeConsultationPage.tsx` - Wardrobe consultation
- `pages/vip/EventStylingPage.tsx` - Event styling service
- `pages/vip/ExclusiveAccessPage.tsx` - Exclusive access products

#### Styling & Personalization Pages
- `pages/styling/StyleQuizPage.tsx` - Style assessment quiz
- `pages/styling/StyleProfilePage.tsx` - Style profile display
- `pages/styling/OutfitBuilderPage.tsx` - Create outfits
- `pages/styling/WardrobePlannerPage.tsx` - Wardrobe planning
- `pages/styling/OccasionStylingPage.tsx` - Occasion-based styling
- `pages/styling/ColorAnalysisPage.tsx` - Personal color analysis
- `pages/styling/BodyTypeAnalysisPage.tsx` - Body type styling
- `pages/styling/VirtualClosetPage.tsx` - Digital wardrobe

#### Social & Community Pages
- `pages/social/FeedPage.tsx` - Social feed
- `pages/social/ProfilePage.tsx` - User public profile
- `pages/social/StyleBoardsPage.tsx` - Style boards (Pinterest-like)
- `pages/social/CollectionsPage.tsx` - User collections
- `pages/social/FollowersPage.tsx` - Followers/following list
- `pages/social/ActivityPage.tsx` - User activity feed
- `pages/social/ForumsPage.tsx` - Discussion forums
- `pages/social/ForumDetailPage.tsx` - Individual forum thread
- `pages/social/EventsPage.tsx` - Community events
- `pages/social/ChallengesPage.tsx` - Style challenges

#### Live Shopping Pages
- `pages/live/LiveShoppingPage.tsx` - Live shopping events list
- `pages/live/LiveEventPage.tsx` - Individual live event
- `pages/live/LiveAuctionPage.tsx` - Live auction
- `pages/live/LiveStylingPage.tsx` - Live styling session
- `pages/live/ScheduledEventsPage.tsx` - Upcoming events calendar

#### AR/VR Pages
- `pages/ar/ARTryOnPage.tsx` - AR try-on experience
- `pages/ar/ARFurniturePage.tsx` - AR furniture placement
- `pages/ar/ARMakeupPage.tsx` - AR makeup try-on
- `pages/vr/VirtualShowroomPage.tsx` - VR store experience
- `pages/vr/VRShoppingPage.tsx` - VR shopping
- `pages/vr/VREventPage.tsx` - VR events

#### Blockchain & Web3 Pages
- `pages/web3/WalletPage.tsx` - Crypto wallet
- `pages/web3/NFTCollectionPage.tsx` - NFT products
- `pages/web3/AuthenticityPage.tsx` - Blockchain authentication
- `pages/web3/ProvenancePage.tsx` - Product provenance
- `pages/web3/MetaverseStorePage.tsx` - Virtual store

#### Sustainability Pages
- `pages/sustainability/SustainabilityPage.tsx` - Sustainability info
- `pages/sustainability/CarbonFootprintPage.tsx` - Carbon calculator
- `pages/sustainability/EcoProductsPage.tsx` - Eco-friendly products
- `pages/sustainability/ImpactPage.tsx` - Impact stories
- `pages/sustainability/RecyclingPage.tsx` - Recycling program

#### Support Pages
- `pages/ContactPage.tsx` - Contact form (exists, enhance)
- `pages/support/HelpCenterPage.tsx` - Help center
- `pages/support/FAQPage.tsx` - Frequently asked questions
- `pages/support/TicketPage.tsx` - Support ticket
- `pages/support/TicketsPage.tsx` - Support tickets list
- `pages/support/ChatPage.tsx` - Live chat
- `pages/support/VideoSupportPage.tsx` - Video call support

### Vendor Pages

#### Vendor Dashboard
- `pages/vendor/DashboardPage.tsx` - Vendor dashboard
- `pages/vendor/AnalyticsPage.tsx` - Analytics and reports
- `pages/vendor/PerformancePage.tsx` - Performance metrics

#### Product Management
- `pages/vendor/ProductsPage.tsx` - Products list
- `pages/vendor/ProductCreatePage.tsx` - Create product
- `pages/vendor/ProductEditPage.tsx` - Edit product
- `pages/vendor/ProductBulkUploadPage.tsx` - Bulk upload
- `pages/vendor/InventoryPage.tsx` - Inventory management
- `pages/vendor/CategoriesPage.tsx` - Manage categories

#### Order Management
- `pages/vendor/OrdersPage.tsx` - Orders list
- `pages/vendor/OrderDetailPage.tsx` - Order details
- `pages/vendor/FulfillmentPage.tsx` - Fulfillment center
- `pages/vendor/ShippingPage.tsx` - Shipping management
- `pages/vendor/ReturnsPage.tsx` - Returns and refunds

#### Financial Management
- `pages/vendor/EarningsPage.tsx` - Earnings dashboard
- `pages/vendor/PayoutsPage.tsx` - Payout history
- `pages/vendor/CommissionPage.tsx` - Commission details
- `pages/vendor/TaxDocumentsPage.tsx` - Tax documents

#### Marketing & Promotions
- `pages/vendor/PromotionsPage.tsx` - Create promotions
- `pages/vendor/CouponsPage.tsx` - Discount codes
- `pages/vendor/MarketingPage.tsx` - Marketing tools
- `pages/vendor/SocialMediaPage.tsx` - Social media integration

#### Vendor Settings
- `pages/vendor/ProfilePage.tsx` - Vendor profile
- `pages/vendor/StorefrontPage.tsx` - Storefront customization
- `pages/vendor/SettingsPage.tsx` - Vendor settings
- `pages/vendor/VerificationPage.tsx` - Verification status

### Admin Pages

#### Admin Dashboard
- `pages/admin/AdminDashboard.tsx` - Admin dashboard (exists, enhance)
- `pages/admin/AnalyticsPage.tsx` - Platform analytics
- `pages/admin/ReportsPage.tsx` - Custom reports

#### User Management
- `pages/admin/UsersPage.tsx` - User management
- `pages/admin/UserDetailPage.tsx` - User details
- `pages/admin/VendorsPage.tsx` - Vendor management
- `pages/admin/VendorDetailPage.tsx` - Vendor details
- `pages/admin/ModeratorsPage.tsx` - Moderator management

#### Product Management
- `pages/admin/AdminProductsPage.tsx` - Products (exists, enhance)
- `pages/admin/ProductApprovalPage.tsx` - Product approval queue
- `pages/admin/CategoriesPage.tsx` - Categories (exists, enhance)
- `pages/admin/BrandsPage.tsx` - Brand management

#### Order Management
- `pages/admin/AdminOrdersPage.tsx` - Orders (exists, enhance)
- `pages/admin/OrderDetailPage.tsx` - Order details
- `pages/admin/DisputesPage.tsx` - Dispute resolution

#### Financial Management
- `pages/admin/TransactionsPage.tsx` - All transactions
- `pages/admin/CommissionsPage.tsx` - Commission management
- `pages/admin/PayoutsPage.tsx` - Vendor payouts
- `pages/admin/RefundsPage.tsx` - Refund management

#### Content Management
- `pages/admin/ContentPage.tsx` - Content management
- `pages/admin/BannersPage.tsx` - Promotional banners
- `pages/admin/CollectionsPage.tsx` - Curated collections
- `pages/admin/BlogPage.tsx` - Blog management

#### System Management
- `pages/admin/SettingsPage.tsx` - System settings
- `pages/admin/IntegrationsPage.tsx` - Third-party integrations
- `pages/admin/APIPage.tsx` - API management
- `pages/admin/LogsPage.tsx` - System logs
- `pages/admin/SecurityPage.tsx` - Security settings

---

## User Flows

### Authentication Flows

#### Registration Flow
1. `SignupPage` → Email/Password or Social Login
2. `VerifyEmailPage` → Email verification
3. `StyleQuizPage` (optional) → Style profile creation
4. `OnboardingPage` → Welcome and preferences
5. Redirect to `Index` (homepage)

#### Login Flow
1. `LoginPage` → Email/Password or Social Login
2. `MFAPage` (if enabled) → Multi-factor authentication
3. Redirect to previous page or `Index`

#### Password Reset Flow
1. `ForgotPasswordPage` → Enter email
2. Email sent → Click link
3. `ResetPasswordPage` → Enter new password
4. Redirect to `LoginPage`

#### KYC Verification Flow
1. `KYCPage` → Upload documents
2. Document review status
3. Verification complete notification

### Shopping Flows

#### Product Discovery Flow
1. `Index` → Browse homepage
2. `ProductsPage` → Filter and search
3. `ProductDetailPage` → View product details
4. `ProductQuickView` → Quick view modal
5. Add to cart or wishlist

#### Search Flow
1. `SearchBar` → Enter search query
2. `SearchSuggestions` → Autocomplete suggestions
3. `SearchPage` → View results
4. `SearchFilters` → Apply filters
5. `ProductDetailPage` → View product

#### Visual Search Flow
1. `VisualSearchButton` → Upload image
2. Image processing → AI analysis
3. `SearchPage` → Similar products
4. `ProductDetailPage` → View matches

#### Voice Search Flow
1. `VoiceSearchButton` → Start recording
2. Speech-to-text → Process query
3. `SearchPage` → Voice search results

#### Product Comparison Flow
1. `ProductDetailPage` → Click "Compare"
2. Add to comparison → Up to 4 products
3. `ComparisonPage` → Side-by-side comparison
4. Select best option → Add to cart

#### Cart to Checkout Flow
1. `CartPage` → Review items
2. Apply promo code → Update totals
3. `CheckoutPage` → Shipping address
4. Select shipping method → Payment method
5. Review order → Place order
6. `CheckoutSuccessPage` → Order confirmation

#### One-Click Purchase Flow
1. `ProductDetailPage` → Click "Buy Now"
2. Use saved address/payment → Confirm
3. Order placed → `CheckoutSuccessPage`

#### Guest Checkout Flow
1. `CartPage` → Click checkout
2. `GuestCheckoutForm` → Enter email
3. `CheckoutPage` → Shipping and payment
4. `CheckoutSuccessPage` → Order confirmation
5. Option to create account

#### Wishlist Flow
1. `ProductDetailPage` → Click "Add to Wishlist"
2. `WishlistSelector` → Choose wishlist
3. `WishlistPage` → View wishlist
4. Add to cart → Purchase

#### Gift Registry Flow
1. `GiftRegistryPage` → Create registry
2. Add products → Share registry
3. Others purchase → Track purchases
4. Thank you notes → Registry completion

### VIP & Concierge Flows

#### Concierge Booking Flow
1. `ConciergePage` → Browse services
2. Select service → Choose date/time
3. Fill details → Confirm booking
4. Confirmation → Service delivered

#### Personal Shopper Flow
1. `PersonalShopperPage` → Book appointment
2. Style preferences → Budget discussion
3. Curated selection → Virtual/in-person meeting
4. Purchase selected items

#### Styling Service Flow
1. `StylistPage` → Book stylist
2. Style quiz → Consultation
3. Outfit recommendations → Purchase
4. Follow-up styling

### AR/VR Flows

#### AR Try-On Flow
1. `ProductDetailPage` → Click "Try On"
2. `ARTryOnPage` → Camera permission
3. AR overlay → Virtual try-on
4. Screenshot/share → Add to cart

#### VR Shopping Flow
1. `VirtualShowroomPage` → Enter VR
2. Navigate store → Browse products
3. Select product → View details
4. Add to cart → Exit VR
5. Complete purchase

### Social Commerce Flows

#### Live Shopping Flow
1. `LiveShoppingPage` → Browse events
2. `LiveEventPage` → Join live stream
3. Chat interaction → View products
4. One-click purchase → Continue watching

#### Social Sharing Flow
1. `ProductDetailPage` → Share button
2. Select platform → Customize message
3. Share → Track engagement

#### Style Board Flow
1. `StyleBoardsPage` → Create board
2. Add products → Organize
3. Share board → Others view
4. Purchase from board

### Support Flows

#### Support Ticket Flow
1. `HelpCenterPage` → Search for help
2. No solution → Create ticket
3. `TicketPage` → Fill details
4. Submit → Track status
5. Resolution → Close ticket

#### Live Chat Flow
1. `ChatPage` → Start chat
2. AI chatbot → Initial response
3. Escalate to human → Resolve
4. End chat → Rate experience

---

## Vendor Flows

### Vendor Onboarding Flow
1. `VendorApplicationPage` → Submit application
2. Document upload → Verification
3. `VendorOnboardingPage` → Complete profile
4. Store setup → First product
5. Approval → Go live

### Product Listing Flow
1. `ProductCreatePage` → Enter details
2. Upload images → Set pricing
3. Inventory → Shipping options
4. Submit for approval → Admin review
5. Approved → Product live

### Order Fulfillment Flow
1. `OrdersPage` → New order notification
2. `OrderDetailPage` → Review order
3. Prepare shipment → Print label
4. Mark shipped → Update tracking
5. Delivery confirmation → Payment released

### Promotion Flow
1. `PromotionsPage` → Create promotion
2. Set discount → Choose products
3. Schedule → Review
4. Launch → Monitor performance

---

## Admin Flows

### Product Approval Flow
1. `ProductApprovalPage` → Review queue
2. `ProductDetailPage` → Inspect product
3. Approve/Reject → Notify vendor
4. Approved → Product live

### Dispute Resolution Flow
1. `DisputesPage` → View disputes
2. `DisputeDetailPage` → Review case
3. Gather evidence → Make decision
4. Refund/Reject → Close dispute

### Vendor Verification Flow
1. `VendorDetailPage` → Review application
2. Check documents → Verify business
3. Approve/Reject → Notify vendor
4. Verified → Badge assigned

---

## Mobile-Specific Components

### Mobile Navigation
- `MobileNav.tsx` - Bottom navigation bar
- `MobileMenu.tsx` - Hamburger menu drawer
- `MobileSearch.tsx` - Full-screen mobile search
- `MobileFilters.tsx` - Mobile filter sheet

### Mobile Shopping
- `MobileProductCard.tsx` - Swipeable product card
- `MobileCart.tsx` - Mobile cart drawer
- `MobileCheckout.tsx` - Mobile-optimized checkout
- `MobileWishlist.tsx` - Mobile wishlist

### Mobile AR
- `MobileARTryOn.tsx` - Mobile AR try-on
- `MobileARCamera.tsx` - AR camera component
- `MobileARControls.tsx` - AR interaction controls

### Mobile Notifications
- `MobilePushPrompt.tsx` - Request push notifications
- `MobileNotificationCenter.tsx` - Notification center
- `MobileNotificationCard.tsx` - Notification card

---

## Shared/Common Components

### Layout Components
- `MainLayout.tsx` - Main layout wrapper (exists, enhance)
- `AdminLayout.tsx` - Admin layout (exists, enhance)
- `VendorLayout.tsx` - Vendor dashboard layout
- `AuthLayout.tsx` - Authentication pages layout
- `Header.tsx` - Site header (exists, enhance)
- `Footer.tsx` - Site footer (exists, enhance)
- `Sidebar.tsx` - Sidebar navigation
- `Breadcrumbs.tsx` - Breadcrumb navigation

### Navigation Components
- `MainNav.tsx` - Main navigation menu
- `CategoryNav.tsx` - Category navigation
- `UserMenu.tsx` - User account menu
- `CartIcon.tsx` - Cart icon with count
- `WishlistIcon.tsx` - Wishlist icon
- `NotificationIcon.tsx` - Notification bell
- `SearchIcon.tsx` - Search trigger

### Data Display Components
- `DataTable.tsx` - Reusable data table
- `Pagination.tsx` - Pagination controls (exists, enhance)
- `InfiniteScroll.tsx` - Infinite scroll loader
- `StatsCard.tsx` - Statistics card
- `Chart.tsx` - Chart component (exists, enhance)
- `Timeline.tsx` - Timeline component
- `ActivityFeed.tsx` - Activity feed

### Form Components
- `FormField.tsx` - Form input field
- `FormSelect.tsx` - Select dropdown
- `FormTextarea.tsx` - Textarea input
- `FormCheckbox.tsx` - Checkbox input
- `FormRadio.tsx` - Radio button group
- `FormDatePicker.tsx` - Date picker
- `FormFileUpload.tsx` - File upload
- `FormImageUpload.tsx` - Image upload with preview
- `FormRichText.tsx` - Rich text editor

### Feedback Components
- `Alert.tsx` - Alert message (exists)
- `Toast.tsx` - Toast notification (exists)
- `Modal.tsx` - Modal dialog (exists)
- `ConfirmDialog.tsx` - Confirmation dialog
- `ProgressBar.tsx` - Progress indicator
- `Tooltip.tsx` - Tooltip (exists)

---

## Modals & Dialogs

### Product Modals
- `ProductQuickViewModal.tsx` - Quick view (exists, enhance)
- `ProductComparisonModal.tsx` - Compare products
- `ProductShareModal.tsx` - Share product
- `ProductAuthenticityModal.tsx` - View certificate
- `ProductProvenanceModal.tsx` - Ownership history
- `Product360ViewModal.tsx` - 360-degree view
- `ProductVideoModal.tsx` - Video player modal

### Shopping Modals
- `AddToCartModal.tsx` - Add to cart confirmation
- `SizeGuideModal.tsx` - Size guide
- `ShippingInfoModal.tsx` - Shipping information
- `ReturnPolicyModal.tsx` - Return policy
- `GiftOptionsModal.tsx` - Gift options
- `SaveForLaterModal.tsx` - Save item confirmation

### Account Modals
- `EditProfileModal.tsx` - Edit profile
- `ChangePasswordModal.tsx` - Change password
- `DeleteAccountModal.tsx` - Delete account confirmation
- `TwoFactorSetupModal.tsx` - Setup 2FA
- `PaymentMethodModal.tsx` - Add/edit payment method
- `AddressModal.tsx` - Add/edit address

### Vendor Modals
- `VendorApplicationModal.tsx` - Apply to be vendor
- `ProductApprovalModal.tsx` - Product approval details
- `CommissionModal.tsx` - Commission details
- `PayoutModal.tsx` - Payout information

### Support Modals
- `ContactModal.tsx` - Contact form
- `LiveChatModal.tsx` - Live chat widget
- `TicketModal.tsx` - Create support ticket
- `FAQModal.tsx` - FAQ search

---

## Forms & Inputs

### Authentication Forms
- `LoginForm.tsx` - Login form
- `SignupForm.tsx` - Registration form
- `PasswordResetForm.tsx` - Password reset
- `MFAForm.tsx` - Multi-factor auth
- `KYCForm.tsx` - KYC verification

### Product Forms
- `ProductForm.tsx` - Product create/edit (exists, enhance)
- `ProductVariantForm.tsx` - Product variants
- `ProductImageUploadForm.tsx` - Image upload
- `ProductPricingForm.tsx` - Pricing and inventory
- `ProductShippingForm.tsx` - Shipping options

### Checkout Forms
- `ShippingForm.tsx` - Shipping address
- `BillingForm.tsx` - Billing address
- `PaymentForm.tsx` - Payment information
- `GiftMessageForm.tsx` - Gift message
- `OrderNotesForm.tsx` - Order notes

### Profile Forms
- `ProfileForm.tsx` - User profile
- `StyleProfileForm.tsx` - Style preferences
- `SizeProfileForm.tsx` - Size information
- `PreferencesForm.tsx` - User preferences

### Vendor Forms
- `VendorApplicationForm.tsx` - Vendor application
- `VendorProfileForm.tsx` - Vendor profile
- `StorefrontForm.tsx` - Storefront customization
- `CommissionForm.tsx` - Commission settings

---

## Data Display Components

### Product Display
- `ProductGrid.tsx` - Product grid layout
- `ProductList.tsx` - Product list layout
- `ProductCarousel.tsx` - Product carousel
- `FeaturedProducts.tsx` - Featured products section
- `RelatedProducts.tsx` - Related products
- `RecentlyViewed.tsx` - Recently viewed products
- `TrendingProducts.tsx` - Trending products
- `NewArrivals.tsx` - New arrivals section

### Order Display
- `OrderCard.tsx` - Order summary card
- `OrderTimeline.tsx` - Order status timeline
- `OrderItems.tsx` - Order items list
- `TrackingMap.tsx` - Delivery tracking map
- `InvoiceView.tsx` - Digital invoice

### Analytics Display
- `SalesChart.tsx` - Sales chart
- `RevenueChart.tsx` - Revenue chart
- `TrafficChart.tsx` - Traffic analytics
- `ConversionFunnel.tsx` - Conversion funnel
- `HeatMap.tsx` - User behavior heatmap
- `CohortTable.tsx` - Cohort analysis table

### Social Display
- `ActivityFeed.tsx` - User activity feed
- `StyleBoard.tsx` - Style board display
- `Collection.tsx` - Product collection
- `UserProfile.tsx` - Public user profile
- `FollowersList.tsx` - Followers/following

---

## Navigation Components

### Main Navigation
- `TopNav.tsx` - Top navigation bar
- `CategoryMenu.tsx` - Category dropdown menu
- `MegaMenu.tsx` - Mega menu for categories
- `BrandMenu.tsx` - Brand navigation
- `SearchNav.tsx` - Search navigation

### User Navigation
- `UserDropdown.tsx` - User account dropdown
- `AccountMenu.tsx` - Account menu items
- `VIPMenu.tsx` - VIP member menu
- `SettingsMenu.tsx` - Settings navigation

### Breadcrumbs
- `BreadcrumbNav.tsx` - Breadcrumb navigation
- `CategoryBreadcrumb.tsx` - Category breadcrumb
- `ProductBreadcrumb.tsx` - Product breadcrumb

---

## Feature-Specific Components

### AI & ML Components
- `AIRecommendations.tsx` - AI product recommendations
- `PersonalizedHomepage.tsx` - Personalized homepage
- `StyleMatcher.tsx` - Style matching algorithm
- `SizePredictor.tsx` - Size prediction
- `PricePredictor.tsx` - Price prediction
- `VisualSearch.tsx` - Visual search interface
- `AIChatbot.tsx` - AI chatbot widget

### AR/VR Components
- `ARViewer.tsx` - AR product viewer
- `ARTryOn.tsx` - AR try-on interface
- `ARControls.tsx` - AR interaction controls
- `VRViewer.tsx` - VR product viewer
- `VRControls.tsx` - VR navigation controls
- `360Viewer.tsx` - 360-degree viewer
- `3DModelViewer.tsx` - 3D model viewer

### Blockchain Components
- `BlockchainBadge.tsx` - Blockchain verification badge
- `NFTCertificate.tsx` - NFT certificate display
- `ProvenanceTimeline.tsx` - Ownership timeline
- `WalletConnect.tsx` - Web3 wallet connection
- `CryptoPayment.tsx` - Cryptocurrency payment
- `BlockchainExplorer.tsx` - View on blockchain

### Social Components
- `ShareButtons.tsx` - Social share buttons
- `FollowButton.tsx` - Follow/unfollow button
- `LikeButton.tsx` - Like product/user
- `CommentSection.tsx` - Comments section
- `LiveChat.tsx` - Live chat interface
- `LiveStream.tsx` - Live streaming player
- `LiveShopping.tsx` - Live shopping interface

### Sustainability Components
- `CarbonFootprint.tsx` - Carbon footprint display
- `SustainabilityBadge.tsx` - Eco-friendly badge
- `ImpactStory.tsx` - Impact story display
- `RecyclingInfo.tsx` - Recycling information
- `EthicalSourcing.tsx` - Ethical sourcing info

### Payment Components
- `PaymentMethods.tsx` - Payment method selector
- `CreditCardForm.tsx` - Credit card input
- `BNPLOptions.tsx` - Buy now pay later options
- `CryptoPayment.tsx` - Cryptocurrency payment
- `WalletBalance.tsx` - Wallet balance display
- `PaymentHistory.tsx` - Payment history

### Shipping Components
- `ShippingCalculator.tsx` - Shipping cost calculator
- `DeliveryOptions.tsx` - Delivery method selector
- `TrackingWidget.tsx` - Order tracking widget
- `DeliveryMap.tsx` - Delivery location map
- `WhiteGloveOptions.tsx` - White-glove service options

---

## Component Organization Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── MFAForm.tsx
│   │   └── ...
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductVariants.tsx
│   │   └── ...
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── ...
│   ├── checkout/
│   │   ├── ShippingForm.tsx
│   │   ├── PaymentForm.tsx
│   │   └── ...
│   ├── vendor/
│   │   ├── VendorCard.tsx
│   │   ├── VendorDashboard.tsx
│   │   └── ...
│   ├── admin/
│   │   ├── AdminSidebar.tsx (exists)
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   ├── social/
│   │   ├── ShareButtons.tsx
│   │   ├── LiveStream.tsx
│   │   └── ...
│   ├── ar-vr/
│   │   ├── ARViewer.tsx
│   │   ├── VRViewer.tsx
│   │   └── ...
│   ├── ai/
│   │   ├── AIRecommendations.tsx
│   │   ├── VisualSearch.tsx
│   │   └── ...
│   ├── blockchain/
│   │   ├── BlockchainBadge.tsx
│   │   ├── NFTCertificate.tsx
│   │   └── ...
│   ├── sustainability/
│   │   ├── CarbonFootprint.tsx
│   │   └── ...
│   ├── modals/
│   │   ├── ProductQuickViewModal.tsx
│   │   ├── AddToCartModal.tsx
│   │   └── ...
│   ├── forms/
│   │   ├── FormField.tsx
│   │   ├── FormSelect.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx (exists)
│   │   ├── Footer.tsx (exists)
│   │   ├── MainLayout.tsx (exists)
│   │   └── ...
│   └── ui/ (shadcn components - exists)
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── ...
│   ├── product/
│   │   ├── ProductsPage.tsx (exists)
│   │   ├── ProductDetailPage.tsx (exists)
│   │   └── ...
│   ├── vendor/
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   └── ...
│   ├── admin/
│   │   ├── AdminDashboard.tsx (exists)
│   │   ├── AdminProducts.tsx (exists)
│   │   └── ...
│   └── ...
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProduct.ts
│   ├── useAR.ts
│   ├── useBlockchain.ts
│   └── ...
│
├── contexts/
│   ├── CartContext.tsx (exists)
│   ├── AuthContext.tsx
│   ├── UserContext.tsx
│   └── ...
│
├── services/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   └── ...
│   ├── ar/
│   │   └── arService.ts
│   └── ...
│
└── utils/
    ├── formatters.ts
    ├── validators.ts
    └── ...
```

---

## Implementation Priority

### Phase 1: Core Components (Weeks 1-4)
- Authentication components
- Product display components
- Cart and checkout components
- Basic layout components
- Essential pages

### Phase 2: Enhanced Features (Weeks 5-8)
- Search and filter components
- Wishlist components
- User profile components
- Vendor dashboard components
- Admin enhancements

### Phase 3: Advanced Features (Weeks 9-12)
- AR/VR components
- AI/ML components
- Social commerce components
- Blockchain components
- Advanced analytics

### Phase 4: Luxury & Innovation (Weeks 13-16)
- VIP and concierge components
- Sustainability components
- Live shopping components
- Experimental features
- Polish and optimization

---

## Development Guidelines

### Component Standards
- Use TypeScript for all components
- Follow React best practices (hooks, functional components)
- Use shadcn/ui components as base
- Implement responsive design (mobile-first)
- Add loading and error states
- Include accessibility features (ARIA labels, keyboard navigation)
- Add proper TypeScript types
- Write component documentation

### State Management
- Use React Context for global state
- Use React Query for server state
- Use local state for component-specific state
- Consider Zustand/Redux for complex state

### Styling
- Use Tailwind CSS for styling
- Follow design system guidelines
- Ensure dark mode support
- Maintain consistent spacing and typography

### Testing
- Unit tests for components
- Integration tests for flows
- E2E tests for critical paths
- Accessibility testing

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Implementation Guide - Reference Document

