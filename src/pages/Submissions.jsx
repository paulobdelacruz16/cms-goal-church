import { useEffect, useState } from 'react'
import {
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  getLatestFormData,
} from '@/api/formdata'

import {
  getFormTemplateById,
} from '@/api/formtemplate'

import { Button } from '@/components/ui/button'

function Submissions() {
  const navigate = useNavigate()

  const [submissions, setSubmissions] =
    useState([])

  const [forms, setForms] =
    useState({})

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)

  useEffect(() => {
    async function loadSubmissions() {
      try {
        setLoading(true)
        setError(null)

        const submissionData =
          await getLatestFormData()

        setSubmissions(
          submissionData
        )

        const uniqueFormIds = [
          ...new Set(
            submissionData.map(
              (submission) =>
                submission.formId
            )
          ),
        ]

        const formResults =
          await Promise.all(
            uniqueFormIds.map(
              async (formId) => {
                const form =
                  await getFormTemplateById(
                    formId
                  )

                return {
                  formId,
                  form,
                }
              }
            )
          )

        const formMap = {}

        formResults.forEach(
          ({ formId, form }) => {
            formMap[formId] = form
          }
        )

        setForms(formMap)
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

    loadSubmissions()
  }, [])

  function getFormName(formId) {
    return (
      forms[formId]?.name ||
      'Unknown Form'
    )
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
          Latest submission for each form
        </p>
      </div>

      {/* Empty */}
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

        /* List */
        <div className="mt-8 overflow-hidden rounded-lg border">

          {/* Header */}
          <div className="grid grid-cols-[1fr_220px_220px] border-b bg-muted/50 px-5 py-3 text-sm font-medium">

            <div>
              Form
            </div>

            <div>
              Submitted
            </div>

            <div className="text-right">
              Actions
            </div>

          </div>

          {/* Rows */}
          {submissions.map(
            (submission) => (
              <div
                key={submission._id}
                className="grid grid-cols-[1fr_220px_220px] items-center border-b px-5 py-4 last:border-b-0"
              >

                {/* Form */}
                <div className="text-sm font-medium">
                  {getFormName(
                    submission.formId
                  )}
                </div>

                {/* Submitted */}
                <div className="text-sm text-muted-foreground">
                  {new Date(
                    submission.submittedAt
                  ).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/forms/${submission.formId}/preview`
                      )
                    }
                  >
                    <Eye />
                    View
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/forms/${submission.formId}/preview`
                      )
                    }
                  >
                    <Pencil />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 />
                    Delete
                  </Button>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  )
}

export default Submissions