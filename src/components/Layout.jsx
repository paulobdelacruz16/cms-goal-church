import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  LogOut,
} from 'lucide-react'

import { logout } from '@/api/auth'

function Layout() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex min-h-16 flex-wrap items-center gap-2 px-4 md:h-16 md:flex-nowrap md:px-6">

          <Link
            to="/"
            className="shrink-0 text-xl font-bold"
          >
            Form Builder
          </Link>

          <nav className="order-3 flex w-full gap-1 overflow-x-auto pb-2 md:order-none md:w-auto md:flex-1 md:justify-left md:pb-0">

            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/forms"
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <FileText size={18} />
              Forms
            </Link>

            <Link
              to="/forms/submissions"
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <ClipboardList size={18} />
              Submissions
            </Link>

          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </header>

      {/* Main content */}
      <main className="min-w-0 p-4 pt-2 md:p-8 md:pt-2">
        <Outlet />
      </main>

    </div>
  )
}

export default Layout
