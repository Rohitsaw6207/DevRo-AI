import { createBrowserRouter } from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Coding from './pages/Coding'
import Pricing from './pages/Pricing'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Profile from './pages/Profile'
import Home from './pages/Home'

import ProtectedRoute from './ProtectedRoute'

export const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },

  // PROTECTED ROUTES
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/coding',
    element: (
      <ProtectedRoute>
        <Coding />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  }
])
