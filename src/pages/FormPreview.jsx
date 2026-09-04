import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, History } from 'lucide-react'

import {
  createFormData,
  getFormDataByFormId,
  updateFormData,
} from '@/api/formdata'

import { getFormTemplateById } from '@/api/formtemplate'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from '@/components/ui/button'

function getInputFields(fields) {
  return fields.flatMap((field) =>
    field.type === 'repeatable'
      ? getInputFields(field.fields || [])
      : [field]
  )
}

function FormPreview() {
  const { id } = useParams()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const [submission, setSubmission] = useState(null)

  const [latestSubmission, setLatestSubmission] =
    useState(null)

  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true)
        setError(null)

        const [
          formData,
          submissionData,
        ] = await Promise.all([
          getFormTemplateById(id),
          getFormDataByFormId(id),
        ])

        setForm(formData)

        const latestSubmission =
          [...submissionData].sort(
            (a, b) =>
              new Date(b.submittedAt) -
              new Date(a.submittedAt)
          )[0] || null

        if (latestSubmission) {
          setLatestSubmission(
            latestSubmission
          )

          setValues(
            latestSubmission.data || {}
          )
        } else {
          setLatestSubmission(null)
          setValues({})
        }
      } catch (error) {
        console.error(
          'Failed to load form:',
          error
        )

        setError(
          'Failed to load form.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadForm()
    }
  }, [id])

  function handleFieldChange(
    field,
    value
  ) {
    setSubmitted(false)
    setSubmitError(null)

    setValues((currentValues) => ({
      ...currentValues,
      [field.name]: value,
    }))
  }

  function validateForm() {
    const newErrors = {}

    for (const field of getInputFields(form.fields || [])) {
      if (!field.required) {
        continue
      }

      const value = values[field.name]

      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        value === false

      if (isEmpty) {
        newErrors[field.name] =
          `${field.label} is required.`
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    try {
      setSubmitting(true)
      setSubmitted(false)
      setSubmitError(null)

      const data = {
        formId: form._id,
        data: values,
        submittedAt: new Date().toISOString(),
      }

      let result =  await createFormData(data)

      setLatestSubmission(result)
      setValues(result.data || values)
      setErrors({})
      setSubmitted(true)
    } catch (error) {
      console.error(
        'Failed to save form:',
        error
      )

      setSubmitError(
        'Something went wrong while saving the form. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">
          Loading form...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive">
          {error}
        </p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">
          Form not found.
        </p>
      </div>
    )
  }

  const isUpdateMode =
    Boolean(latestSubmission)

  return (
    <div className="min-h-full bg-muted/30 p-6 md:p-10">

      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-primary">
              Form Preview
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {form.name}
            </h1>

            {form.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {form.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">

            {isUpdateMode && (
              <Button
                asChild
                variant="outline"
              >
                <Link
                  to={`/forms/${form._id}/history`}
                >
                  <History />
                  History
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
            >
              <Link
                to={`/forms/${form._id}/edit`}
              >
                <ArrowLeft />
                Back to Builder
              </Link>
            </Button>

          </div>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-background p-6 shadow-sm md:p-8"
        >

          <div className="space-y-6">

            {form.fields?.length > 0 ? (
              form.fields.map((field) => (
                <PreviewField
                  key={field.id}
                  field={field}
                  value={values[field.name]}
                  values={values}
                  error={errors[field.name]}
                  errors={errors}
                  onChange={handleFieldChange}
                />
              ))
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                This form has no fields yet.
              </div>
            )}

          </div>

          {/* Submit / Update */}
          {form.fields?.length > 0 && (
            <div className="mt-8 border-t pt-6">

              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? isUpdateMode
                    ? 'Updating...'
                    : 'Submitting...'
                  : isUpdateMode
                    ? 'Update'
                    : form.submitButtonText || 'Submit'}
              </Button>

            </div>
          )}

          {submitted && (
            <div
              role="status"
              className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {isUpdateMode
                ? 'Your response has been updated.'
                : form.successMessage ||
                'Thank you! Your response has been submitted.'}
            </div>
          )}

          {submitError && (
            <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {submitError}
            </div>
          )}

        </form>

      </div>

    </div>
  )
}

function PreviewField({
  field,
  value,
  values,
  onChange,
  error,
  errors,
}) {
  if (field.type === 'repeatable') {
    return (
      <div className="rounded-lg border border-dashed p-4">
        <div>
          <h2 className="font-medium">
            {field.label}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Repeatable Container
          </p>
        </div>

        <div className="mt-4 space-y-6">
          {field.fields?.length > 0 ? (
            field.fields.map((nestedField) => (
              <PreviewField
                key={nestedField.id}
                field={nestedField}
                value={values[nestedField.name]}
                values={values}
                error={errors[nestedField.name]}
                errors={errors}
                onChange={onChange}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No fields in this container.
            </p>
          )}
        </div>
      </div>
    )
  }

  const inputId = `preview-${field.id}`

  function handleChange(newValue) {
    onChange(field, newValue)
  }

  return (
    <div className="space-y-2">

      {/* Label */}
      {field.type !== 'checkbox' && (
        <Label htmlFor={inputId}>
          {field.label}

          {field.required && (
            <span className="ml-1 text-destructive">
              *
            </span>
          )}
        </Label>
      )}

      {/* Text */}
      {field.type === 'text' && (
        <Input
          id={inputId}
          type="text"
          value={value || ''}
          placeholder={field.placeholder || ''}
          onChange={(event) =>
            handleChange(
              event.target.value
            )
          }
        />
      )}

      {/* Email */}
      {field.type === 'email' && (
        <Input
          id={inputId}
          type="email"
          value={value || ''}
          placeholder={field.placeholder || ''}
          onChange={(event) =>
            handleChange(
              event.target.value
            )
          }
        />
      )}

      {/* Number */}
      {field.type === 'number' && (
        <Input
          id={inputId}
          type="number"
          value={value || ''}
          placeholder={field.placeholder || ''}
          onChange={(event) =>
            handleChange(
              event.target.value
            )
          }
        />
      )}

      {/* Textarea */}
      {field.type === 'textarea' && (
        <Textarea
          id={inputId}
          value={value || ''}
          placeholder={field.placeholder || ''}
          onChange={(event) =>
            handleChange(
              event.target.value
            )
          }
        />
      )}

      {/* Select */}
      {field.type === 'select' && (
        <Select
          value={value || ''}
          onValueChange={handleChange}
        >
          <SelectTrigger id={inputId}>
            <SelectValue
              placeholder={
                field.placeholder ||
                'Select an option'
              }
            />
          </SelectTrigger>

          <SelectContent>
            {(field.options || []).map(
              (option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      )}

      {/* Radio */}
      {field.type === 'radio' && (
        <RadioGroup
          value={value || ''}
          onValueChange={handleChange}
        >
          {(field.options || []).map(
            (option) => (
              <div
                key={option.value}
                className="flex items-center gap-2"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${inputId}-${option.value}`}
                />

                <Label
                  htmlFor={`${inputId}-${option.value}`}
                >
                  {option.label}
                </Label>
              </div>
            )
          )}
        </RadioGroup>
      )}

      {/* Checkbox */}
      {field.type === 'checkbox' && (
        <div className="flex items-center gap-2">

          <Checkbox
            id={inputId}
            checked={Boolean(value)}
            onCheckedChange={handleChange}
          />

          <Label htmlFor={inputId}>
            {field.label}

            {field.required && (
              <span className="ml-1 text-destructive">
                *
              </span>
            )}
          </Label>

        </div>
      )}

      {/* Date */}
      {field.type === 'date' && (
        <Input
          id={inputId}
          type="date"
          value={value || ''}
          onChange={(event) =>
            handleChange(
              event.target.value
            )
          }
        />
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

    </div>
  )
}

export default FormPreview
