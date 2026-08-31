import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Eye, X } from 'lucide-react'

import { getFormData } from '@/api/formdata'
import {
  getFormTemplateById,
} from '@/api/formtemplate'

import { Button } from '@/components/ui/button'

function Submissions() {
  const { id: formId } = useParams()

  const [submissions, setSubmissions] = useState([])
  const [form, setForm] = useState(null)
  const [selectedSubmission, setSelectedSubmission] =
    useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadSubmissions() {
      try {
        setLoading(true)
        setError(null)

        const [
          submissionData,
          formData,
        ] = await Promise.all([
          getFormData(),
          getFormTemplateById(formId),
        ])

        const filteredSubmissions =
          submissionData.filter(
            (submission) =>
              submission.formId === formId
          )

        setSubmissions(filteredSubmissions)
        setForm(formData)
      } catch (error) {
        console.error(
          'Failed to load submissions:',
          error
        )

        setError(
          'Failed to load submissions.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      loadSubmissions()
    }
  }, [formId])

  function getFieldLabel(fieldName) {
    const field = form?.fields?.find(
      (field) =>
        field.name === fieldName
    )

    return field?.label || fieldName
  }

  function handleViewSubmission(submission) {
    setSelectedSubmission(submission)
  }

  function handleCloseSubmission() {
    setSelectedSubmission(null)
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Submissions
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Loading submissions...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">
          Submissions
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
      <div>
        <h1 className="text-3xl font-bold">
          Submissions
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {submissions.length} submission
          {submissions.length !== 1
            ? 's'
            : ''}
        </p>
      </div>

      {/* Submission List */}
      {submissions.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center">
          <p className="font-medium">
            No submissions yet
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Submitted form data will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">

          {submissions.map(
            (submission) => (
              <div
                key={submission._id}
                className="rounded-lg border bg-background p-5"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium">
                      Submission
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(
                        submission.submittedAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewSubmission(
                        submission
                      )
                    }
                  >
                    <Eye />
                    View
                  </Button>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* Submission Details */}
      {selectedSubmission && (
        <div className="mt-8 rounded-xl border bg-background p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between border-b pb-4">

            <div>
              <h2 className="text-lg font-semibold">
                Submission Details
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(
                  selectedSubmission.submittedAt
                ).toLocaleString()}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={
                handleCloseSubmission
              }
              title="Close"
            >
              <X />
            </Button>

          </div>

          <div className="space-y-4">

            {Object.entries(
              selectedSubmission.data || {}
            ).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[160px_1fr] gap-4 rounded-lg border p-4"
                >
                  <div className="text-sm font-medium text-muted-foreground">
                    {getFieldLabel(key)}
                  </div>

                  <div className="break-words text-sm">
                    {String(value)}
                  </div>
                </div>
              )
            )}

          </div>

        </div>
      )}

    </div>
  )
}

export default Submissions