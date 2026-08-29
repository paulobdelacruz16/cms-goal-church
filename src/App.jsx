import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Forms from './pages/Forms'
import FormBuilder from './pages/FormBuilder'
import FormPreview from './pages/FormPreview'
import Login from './pages/Login'
import Submissions from './pages/Submissions'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/login" element={<Login />} />

        <Route path="/forms" element={<Forms />} />

        <Route
          path="/forms/new"
          element={<FormBuilder />}
        />

        <Route
          path="/forms/:id"
          element={<FormBuilder />}
        />

        <Route
          path="/forms/:id/preview"
          element={<FormPreview />}
        />

        <Route
          path="/forms/:id/data"
          element={<Submissions />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App