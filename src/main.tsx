import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AppLayout } from './modules/layout/AppLayout'
import { HomePage } from './modules/home/HomePage'
import { WatchlistPage } from './modules/watchlist/WatchlistPage'
import { ProductDetailPage } from './modules/products/ProductDetailPage'
import { PopularProductsPage } from './modules/popular/PopularProductsPage'
import { PriceDropsPage } from './modules/drops/PriceDropsPage'
import { SignInPage } from './modules/auth/SignInPage'
import { SignUpPage } from './modules/auth/SignUpPage'
import { ForgotPasswordPage } from './modules/auth/ForgotPasswordPage'
import { AboutPage } from './modules/pages/AboutPage'
import { BlogPage } from './modules/pages/BlogPage'
import { FeaturesPage } from './modules/pages/FeaturesPage'
import { TermsPage } from './modules/pages/TermsPage'
import { PrivacyPage } from './modules/pages/PrivacyPage'
import { ToolsPage } from './modules/pages/ToolsPage'
import { HelpPage } from './modules/pages/HelpPage'
import { BusinessDashboard } from './modules/business/BusinessDashboard'
import { SearchPage } from './modules/search/SearchPage'
import { ProtectedAdminRoute } from './modules/admin/ProtectedAdminRoute'
import { CuratedTrackingDashboard } from './modules/admin/CuratedTrackingDashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'watchlist', element: <WatchlistPage /> },
      { path: 'popular', element: <PopularProductsPage /> },
      { path: 'drops', element: <PriceDropsPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'features', element: <FeaturesPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'tools', element: <ToolsPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'business', element: <BusinessDashboard /> },
      { path: 'admin', element: <ProtectedAdminRoute /> },
      { path: 'zobda-admin', element: <ProtectedAdminRoute /> },
      { path: 'admin/tracking', element: <CuratedTrackingDashboard /> },
      { path: 'prod', element: <HomePage /> }, // Production route
    ],
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
])

const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


