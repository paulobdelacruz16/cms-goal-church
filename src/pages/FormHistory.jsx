import { useEffect, useState } from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'
import {
  ArrowLeft,
  RotateCcw,
} from 'lucide-react'

import {
  getFormDataByFormId,
  createFormData,
} from '@/api/formdata'

import {
  getFormTemplateById,
} from '@/api/formtemplate'

import { Button } from '@/components/ui/button'

function FormHistory() {
  const { id: formId } = useParams()

  const [submissions, setSubmissions] =
    useState([])

  const [form, setForm] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)

  const [selectedIndex, setSelectedIndex] =
    useState(null)

  const [revertingId, setRevertingId] =
    useState(null)

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

        setSubmissions(
          sortedSubmissions
        )

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

  function getChanges(
    currentSubmission,
    previousSubmission
  ) {
    const currentData =
      currentSubmission?.data || {}

    const previousData =
      previousSubmission?.data || {}

    const keys = new Set([
      ...Object.keys(currentData),
      ...Object.keys(previousData),
    ])

    return [...keys]
      .map((key) => {
        const currentValue =
          currentData[key]

        const previousValue =
          previousData[key]

        const current =
          currentValue == null
            ? ''
            : String(currentValue)

        const previous =
          previousValue == null
            ? ''
            : String(previousValue)

        return {
          key,
          label: getFieldLabel(key),
          current,
          previous,
          changed:
            current !== previous,
        }
      })
      .filter(
        (change) => change.changed
      )
  }

  function handleView(index) {
    setSelectedIndex(
      selectedIndex === index
        ? null
        : index
    )
  }

  async function handleRevert(
    submission
  ) {
    const confirmed =
      window.confirm(
        'Revert to this version? This will create a new version and keep the existing history.'
      )

    if (!confirmed) {
      return
    }

    try {
      setRevertingId(
        submission._id
      )
      setError(null)

      await createFormData({
        formId: submission.formId,
        data: submission.data,
        submittedAt: new Date().toISOString()
      })

      const submissionData =
        await getFormDataByFormId(
          formId
        )

      const sortedSubmissions =
        [...submissionData].sort(
          (a, b) =>
            new Date(b.submittedAt) -
            new Date(a.submittedAt)
        )

      setSubmissions(
        sortedSubmissions
      )

      setSelectedIndex(null)
    } catch (error) {
      console.error(
        'Failed to revert form data:',
        error
      )

      setError(
        'Failed to revert this version.'
      )
    } finally {
      setRevertingId(null)
    }
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
        <div className="mt-8 space-y-3">

          {submissions.map(
            (submission, index) => {
              const previousSubmission =
                submissions[index + 1]

              const changes =
                previousSubmission
                  ? getChanges(
                    submission,
                    previousSubmission
                  )
                  : []

              const isSelected =
                selectedIndex === index

              return (
                <div
                  key={submission._id}
                  className="rounded-lg border bg-background"
                >

                  {/* Version row */}
                  <div className="flex items-center justify-between p-5">

                    <div>
                      <div className="flex items-center gap-3">

                        <p className="font-medium">
                          Version{' '}
                          {submissions.length - index}
                        </p>

                        {index === 0 && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Latest
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          submission.submittedAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">

                      {/* View */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleView(index)
                        }
                      >
                        {isSelected
                          ? 'Hide'
                          : 'View'}
                      </Button>

                      {/* Revert */}
                      {index !== 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            revertingId ===
                            submission._id
                          }
                          onClick={() =>
                            handleRevert(
                              submission
                            )
                          }
                        >
                          <RotateCcw />

                          {revertingId ===
                            submission._id
                            ? 'Reverting...'
                            : 'Revert'}
                        </Button>
                      )}

                    </div>

                  </div>

                  {/* Comparison */}
                  {isSelected && (
                    <div className="border-t px-5 py-5">

                      {index ===
                        submissions.length - 1 ? (
                        <div className="rounded-lg border border-dashed p-6 text-center">

                          <p className="font-medium">
                            Initial version
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            This is the first recorded
                            version, so there are no
                            previous changes to compare.
                          </p>

                        </div>
                      ) : changes.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6 text-center">

                          <p className="font-medium">
                            No changes
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            This version contains the
                            same values as the previous
                            version.
                          </p>

                        </div>
                      ) : (
                        <div>

                          <div className="mb-4">

                            <h3 className="font-semibold">
                              Changes
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                              Compared with the previous
                              version.
                            </p>

                          </div>

                          <div className="space-y-4">

                            {changes.map(
                              (change) => (
                                <div
                                  key={change.key}
                                  className="rounded-lg border p-4"
                                >

                                  <p className="mb-3 text-sm font-medium">
                                    {change.label}
                                  </p>

                                  <div className="grid gap-3 md:grid-cols-2">

                                    <div>
                                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                                        Previous
                                      </p>

                                      <div className="rounded-md bg-muted px-3 py-2 text-sm">
                                        {change.previous ||
                                          '—'}
                                      </div>
                                    </div>

                                    <div>
                                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                                        Current
                                      </p>

                                      <div className="rounded-md bg-muted px-3 py-2 text-sm">
                                        {change.current ||
                                          '—'}
                                      </div>
                                    </div>

                                  </div>

                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              )
            }
          )}

        </div>
      )}

    </div>
  )
}

export default FormHistory