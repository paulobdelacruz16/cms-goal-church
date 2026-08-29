import { Link } from 'react-router-dom'
import { Plus, FileText, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  useDynamicPageContent,
  useDeleteDynamicPageContent,
} from '@/hooks/useDynamicPageContent'

function Forms() {
  const {
    data: forms,
    isLoading,
    isError,
    error,
  } = useDynamicPageContent()

  const deleteMutation = useDeleteDynamicPageContent()

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this form?'
    )

    if (!confirmed) {
      return
    }

    deleteMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <div>
        Loading forms...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Forms
          </h1>

          <p className="mt-1 text-muted-foreground">
            Create and manage your forms.
          </p>
        </div>

        <Button asChild>
          <Link to="/forms/new">
            <Plus />
            Create Form
          </Link>
        </Button>

      </div>

      {/* Forms */}
      {forms?.length === 0 ? (

        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border bg-card">

          <FileText
            size={40}
            className="text-muted-foreground"
          />

          <h2 className="mt-4 text-lg font-semibold">
            No forms yet
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first form to get started.
          </p>

        </div>

      ) : (

        <div className="grid gap-4">

          {forms?.map((form) => (

            <div
              key={form._id}
              className="flex items-center justify-between rounded-xl border bg-card p-5"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-lg border p-2">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    {form.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {form.fields?.length || 0} fields
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <Button
                  variant="outline"
                  asChild
                >
                  <Link to={`/forms/${form._id}`}>
                    Edit
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(form._id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 />
                </Button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default Forms