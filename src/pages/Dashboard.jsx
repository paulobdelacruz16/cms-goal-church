import {
  FileText,
  Database,
  Plus,
} from 'lucide-react'

import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your forms and submissions.
          </p>
        </div>

        <Link
          to="/forms/new"
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Create Form
        </Link>

      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Forms
              </p>

              <p className="mt-2 text-3xl font-bold">
                0
              </p>
            </div>

            <FileText size={28} />

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Submissions
              </p>

              <p className="mt-2 text-3xl font-bold">
                0
              </p>
            </div>

            <Database size={28} />

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard