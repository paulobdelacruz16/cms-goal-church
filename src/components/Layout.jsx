import { Link, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  LogIn,
} from 'lucide-react'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">

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

      <div className="flex flex-col md:flex-row">

        {/* Sidebar */}
        <aside className="w-full border-b bg-white md:min-h-[calc(100vh-4rem)] md:w-64 md:border-r md:border-b-0">

          <nav className="flex gap-1 overflow-x-auto p-2 md:block md:space-y-1 md:p-4">

            {/* Dashboard */}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            {/* Forms */}
            <Link
              to="/forms"
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <FileText size={18} />
              Forms
            </Link>

            {/* Submissions */}
            <Link
              to="/forms/submissions"
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
            >
              <ClipboardList size={18} />
              Submissions
            </Link>

          </nav>

        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default Layout
