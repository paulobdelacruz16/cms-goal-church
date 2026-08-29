import { Link, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  LogIn,
} from 'lucide-react'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">

          <Link
            to="/"
            className="text-xl font-bold"
          >
            Form Builder
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LogIn size={18} />
            Login
          </Link>

        </div>
      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside className="min-h-[calc(100vh-4rem)] w-64 border-r bg-white">

          <nav className="space-y-1 p-4">

            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/forms"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <FileText size={18} />
              Forms
            </Link>

          </nav>

        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default Layout