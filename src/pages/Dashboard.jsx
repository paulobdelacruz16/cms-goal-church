import { useQuery } from '@tanstack/react-query'
import { FileText, Database } from 'lucide-react'

import { getLatestFormData } from '@/api/formdata'
import { getAuthSession } from '@/api/auth'
import { useFormTemplate } from '@/hooks/useFormTemplate'

function Dashboard() {
  const session = getAuthSession()
  const { data: forms = [] } = useFormTemplate()
  const { data: submissions = [] } = useQuery({
    queryKey: ['formdata', 'latest'],
    queryFn: getLatestFormData,
  })

  const formIds = new Set(
    forms.map((form) => form._id)
  )

  const availableSubmissions = submissions.filter(
    (submission) => formIds.has(submission.formId)
  )

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-muted-foreground">
            Welcome, {session?.name || session?.username}.
          </p>
        </div>
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
                {forms.length}
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
                {availableSubmissions.length}
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