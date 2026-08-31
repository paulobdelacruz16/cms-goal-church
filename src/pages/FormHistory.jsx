import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { getFormDataByFormId } from '@/api/formdata'
import { getFormTemplateById } from '@/api/formtemplate'

import { Button } from '@/components/ui/button'

function FormHistory() {
  const { id: formId } = useParams()

  const [submissions, setSubmissions] = useState([])
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)
        setError(null)

        const [
          submissionData,
          formData,
        ] = await Promise.all([
          getFormDataByFormId(formId),
          getFormTemplateById(formId),
        ])

        const sortedSubmissions =
          [...submissionData].sort(
            (a, b) =>
              new Date(b.submittedAt) -
              new Date(a.submittedAt)
          )

        setSubmissions(sortedSubmissions)
        setForm(formData)
      } catch (error) {
        console.error(
          'Failed to load form history:',
          error
        )

        setError(
          'Failed to load form history.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      loadHistory()
    }
  }, [formId])

  function getFieldLabel(fieldName) {
    const field = form?.fields?.find(
      (field) =>
        field.name === fieldName
    )

    return field?.label || fieldName
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          History
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Loading history...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          History
        </h1>

        <p className="mt-2 text-sm text-destructive">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <div className="flex items-center gap-3">

            <Button
              asChild
              variant="ghost"
              size="icon"
            >
              <Link
                to={`/forms/${formId}/preview`}
              >
                <ArrowLeft />
              </Link>
            </Button>

            <div>
              <h1 className="text-3xl font-bold">
                {form?.name || 'Form History'}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {submissions.length} version
                {submissions.length !== 1
                  ? 's'
                  : ''}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* History */}
      {submissions.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center">

          <p className="font-medium">
            No history yet
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Previous form data will appear here
            after the form is updated.
          </p>

        </div>
      ) : (
        <div className="mt-8 space-y-4">

          {submissions.map(
            (submission, index) => (
              <div
                key={submission._id}
                className="rounded-lg border bg-background p-5"
              >

                {/* Version header */}
                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <p className="font-medium">
                      Version {submissions.length - index}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        submission.submittedAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                  >
                    View
                  </Button>

                </div>

                {/* Data */}
                <div className="space-y-3">

                  {Object.entries(
                    submission.data || {}
                  ).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[140px_1fr] gap-4 text-sm"
                      >

                        <div className="font-medium text-muted-foreground">
                          {getFieldLabel(key)}
                        </div>

                        <div className="break-words">
                          {String(value)}
                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  )
}

export default FormHistory