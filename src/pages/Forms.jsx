import {
  Plus,
  FileText,
} from 'lucide-react'

import { Link } from 'react-router-dom'

function Forms() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Forms
          </h1>

          <p className="mt-1 text-gray-500">
            Create and manage your forms.
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

      {/* Empty state */}
      <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border bg-white">

        <FileText
          size={40}
          className="text-gray-400"
        />

        <h2 className="mt-4 text-lg font-semibold">
          No forms yet
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create your first form to get started.
        </p>

        <Link
          to="/forms/new"
          className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create Form
        </Link>

      </div>

    </div>
  )
}

export default Forms