import React, { useEffect, useState } from 'react'
import { AdminAuth } from './AdminAuth'
import { AdminDashboard } from './AdminDashboard'

export const ProtectedAdminRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if admin is authenticated
    const adminSession = localStorage.getItem('zobda_admin_session')
    setIsAuthenticated(adminSession === 'true')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('zobda_admin_session')
    setIsAuthenticated(false)
  }

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zobda-orange mx-auto"></div>
          <p className="mt-4 text-zobda-gray">Checking admin access...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminAuth />
  }

  // Show admin dashboard if authenticated
  return (
    <div>
      <div className="bg-zobda-orange text-white py-2 px-4 flex justify-between items-center">
        <span className="text-sm font-medium">Admin Mode</span>
        <button
          onClick={handleLogout}
          className="text-sm hover:underline"
        >
          Logout
        </button>
      </div>
      <AdminDashboard />
    </div>
  )
}
