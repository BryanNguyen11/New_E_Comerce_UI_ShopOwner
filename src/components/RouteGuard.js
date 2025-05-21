'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// List of routes that don't require authentication
const publicRoutes = ['/home', '/']

// List of explicitly protected routes (for clarity)
const protectedRoutes = ['/cart', '/dashboard']

export default function RouteGuard({ children }) {
  const { authState, isLoading, kcLogin } = useAuth()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if the current path is public or user is authenticated
    const isPublicRoute = publicRoutes.some(route => {
      if (route === '/') return pathname === '/'
      return pathname.startsWith(route)
    })
    
    // Check if current path is explicitly protected
    const isProtectedRoute = protectedRoutes.some(route => {
      return pathname.startsWith(route)
    })
    
    // If route requires auth and user is not authenticated
    if ((isProtectedRoute || !isPublicRoute) && !authState.isAuthenticated && !isLoading) {
      // Redirect directly to Keycloak login
      console.log('Redirecting to Keycloak login:', pathname)
      kcLogin()
      return
    }
    
    setIsAuthorized(true)
  }, [pathname, authState.isAuthenticated, isLoading, kcLogin])

  // Show loading while checking authentication
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600">Đang chuyển hướng...</p>
      </div>
    )
  }

  // Only render children if authorized
  return children
}

