import { Button } from '@/components/ui/button'
import { FileText, Database, Plus } from 'lucide-react'
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

          <p className="mt-1 text-muted-foreground">
            Manage your forms and submissions.
          </p>
        </div>

        <Button asChild>
          <Link to="/forms/new">
            <Plus />
            Create Form
          </Link>
        </Button>

      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border bg-card p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-muted-foreground">
                Total Forms
              </p>

              <p className="mt-2 text-3xl font-bold">
                0
              </p>
            </div>

            <FileText size={28} />

          </div>

        </div>

        <div className="rounded-xl border bg-card p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-muted-foreground">
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