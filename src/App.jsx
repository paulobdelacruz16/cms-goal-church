import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import Forms from './pages/Forms'
import FormBuilder from './pages/FormBuilder'
import FormPreview from './pages/FormPreview'
import Login from './pages/Login'
import Submissions from './pages/Submissions'
import FormHistory from './pages/FormHistory'
import { getAuthSession } from '@/api/auth'

function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!getAuthSession()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return children
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Application */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/forms"
            element={<Forms />}
          />

          <Route
            path="/forms/new"
            element={<FormBuilder />}
          />

          <Route
            path="/forms/submissions"
            element={<Submissions />}
          />
          <Route
            path="/forms/:id/history"
            element={<FormHistory />}
          />

          <Route
            path="/forms/:id/history/:formdataId"
            element={<FormHistory />}
          />

          <Route
            path="/forms/:id"
            element={<FormBuilder />}
          />



          <Route
            path="/forms/:id/edit"
            element={<FormBuilder />}
          />

          <Route
            path="/forms/:id/preview"
            element={<FormPreview />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App