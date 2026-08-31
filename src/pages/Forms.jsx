import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  useFormTemplate,
  useDeleteFormTemplate,
} from '@/hooks/useFormTemplate'

function Forms() {
  const {
    data: forms = [],
    isLoading,
    isError,
  } = useFormTemplate()

  const deleteMutation = useDeleteFormTemplate()

  function handleDelete(id) {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this form?'
      )

    if (!confirmed) {
      return
    }

    deleteMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        Loading forms...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-sm text-destructive">
        Failed to load forms.
      </div>
    )
  }

  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Forms
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your forms.
          </p>
        </div>

        <Button asChild>
          <Link to="/forms/new">
            <Plus />
            Create Form
          </Link>
        </Button>

      </div>

      {/* Empty state */}

      {forms.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">

          <h2 className="font-semibold">
            No forms yet
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first form to get started.
          </p>

          <Button
            className="mt-6"
            asChild
          >
            <Link to="/forms/new">
              <Plus />
              Create Form
            </Link>
          </Button>

        </div>
      ) : (

        /* Form list */

        <div className="overflow-hidden rounded-xl border">

          {forms.map((form) => (
            <div
              key={form._id}
              className="flex items-center justify-between border-b p-5 last:border-b-0"
            >

              <div className="min-w-0">

                <h2 className="truncate font-semibold">
                  {form.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  /{form.slug}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {form.fields?.length || 0} fields
                </p>

              </div>

              <div className="ml-4 flex shrink-0 gap-2">

                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <Link
                    to={`/forms/${form._id}/edit`}
                  >
                    <Pencil />
                  </Link>
                </Button>

                <Button asChild size="icon" variant="outline">
                  <Link to={`/forms/${form._id}/preview`}>
                    <Eye />
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