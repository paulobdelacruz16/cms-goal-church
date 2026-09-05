import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  History,
  Plus,
  Trash2,
  Image as ImageIcon,
  X,
} from 'lucide-react'

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

function validateFields(
  fields,
  values,
  errors,
  path = ''
) {
  for (const field of fields) {
    const fieldPath =
      path
        ? `${path}.${field.name}`
        : field.name

    if (field.type === 'repeatable') {
      const entries = values[field.name]

      if (Array.isArray(entries)) {
        entries.forEach((entry, index) => {
          validateFields(
            field.fields || [],
            entry,
            errors,
            `${fieldPath}.${index}`
          )
        })
      }

      continue
    }

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
      errors[fieldPath] =
        `${field.label} is required.`
    }
  }
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

  function handleRepeatableEntryAdd(field) {
    setSubmitted(false)
    setSubmitError(null)

    setValues((currentValues) => {
      const entries = Array.isArray(
        currentValues[field.name]
      )
        ? currentValues[field.name]
        : []

      return {
        ...currentValues,
        [field.name]: [
          ...entries,
          {},
        ],
      }
    })
  }

  function handleRepeatableEntryRemove(
    field,
    entryIndex
  ) {
    setSubmitted(false)
    setSubmitError(null)

    setValues((currentValues) => {
      const entries = Array.isArray(
        currentValues[field.name]
      )
        ? currentValues[field.name]
        : [{}]

      return {
        ...currentValues,
        [field.name]: entries.filter(
          (_, index) => index !== entryIndex
        ),
      }
    })
  }

  function handleRepeatableFieldChange(
    repeatableField,
    entryIndex,
    field,
    value
  ) {
    setSubmitted(false)
    setSubmitError(null)

    setValues((currentValues) => {
      const entries = Array.isArray(
        currentValues[repeatableField.name]
      )
        ? currentValues[repeatableField.name]
        : [{}]

      return {
        ...currentValues,
        [repeatableField.name]: entries.map(
          (entry, index) =>
            index === entryIndex
              ? {
                ...entry,
                [field.name]: value,
              }
              : entry
        ),
      }
    })
  }

  function validateForm() {
    const newErrors = {}

    validateFields(
      form.fields || [],
      values,
      newErrors
    )

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
                  error={errors[field.name]}
                  errors={errors}
                  fieldPath={field.name}
                  onChange={handleFieldChange}
                  onRepeatableAdd={
                    handleRepeatableEntryAdd
                  }
                  onRepeatableRemove={
                    handleRepeatableEntryRemove
                  }
                  onRepeatableFieldChange={
                    handleRepeatableFieldChange
                  }
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

const IMAGE_REPO_URL =
  'https://api.github.com/repos/paulobdelacruz16/images/contents/'

function isImageFileName(fileName = '') {
  return /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(fileName)
}

function GitHubImagePickerModal({
  open,
  onClose,
  onSelect,
}) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) {
      return
    }

    async function loadImages() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(IMAGE_REPO_URL, {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        })

        if (!response.ok) {
          throw new Error('Unable to load images from GitHub.')
        }

        const data = await response.json()

        const fileItems = Array.isArray(data)
          ? data.filter(
              (item) =>
                item?.type === 'file' &&
                isImageFileName(item?.name)
            )
          : []

        setImages(fileItems)
      } catch (loadError) {
        console.error('Failed to fetch repo images:', loadError)
        setError('Unable to load images from the repository right now.')
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-3xl rounded-xl border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold">
              Choose an image
            </h3>
            <p className="text-sm text-muted-foreground">
              Select one from the GitHub image repository.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close image picker"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading images...
            </p>
          )}

          {!loading && error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No images found in the repository.
            </p>
          )}

          {!loading && !error && images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((image) => (
                <button
                  key={image.path}
                  type="button"
                  className="group overflow-hidden rounded-lg border bg-muted/20 text-left transition hover:border-primary"
                  onClick={() => {
                    onSelect(image.download_url || image.html_url)
                    onClose()
                  }}
                >
                  <img
                    src={image.download_url}
                    alt={image.name}
                    className="h-32 w-full object-cover"
                  />

                  <div className="border-t px-3 py-2 text-xs text-muted-foreground group-hover:text-foreground">
                    {image.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewField({
  field,
  value,
  onChange,
  error,
  errors,
  fieldPath,
  onRepeatableAdd,
  onRepeatableRemove,
  onRepeatableFieldChange,
}) {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)

  if (field.type === 'repeatable') {
    const entries = Array.isArray(value)
      ? value
      : [{}]

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

        <div className="mt-4 space-y-4">
          {entries.map((entry, entryIndex) => (
            <div
              key={`${field.id}-${entryIndex}`}
              className="rounded-md border bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  Entry {entryIndex + 1}
                </p>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onRepeatableRemove(
                      field,
                      entryIndex
                    )
                  }
                >
                  <Trash2 />
                  Remove
                </Button>
              </div>

              <div className="mt-4 space-y-6">
                {field.fields?.map(
                  (nestedField) => {
                    const nestedFieldPath =
                      `${fieldPath}.${entryIndex}.${nestedField.name}`

                    return (
                      <PreviewField
                        key={nestedField.id}
                        field={nestedField}
                        value={entry[nestedField.name]}
                        error={errors[nestedFieldPath]}
                        errors={errors}
                        fieldPath={nestedFieldPath}
                        onChange={(
                          changedField,
                          newValue
                        ) =>
                          onRepeatableFieldChange(
                            field,
                            entryIndex,
                            changedField,
                            newValue
                          )
                        }
                        onRepeatableAdd={
                          onRepeatableAdd
                        }
                        onRepeatableRemove={
                          onRepeatableRemove
                        }
                        onRepeatableFieldChange={
                          onRepeatableFieldChange
                        }
                      />
                    )
                  }
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRepeatableAdd(field)}
          >
            <Plus />
            Add another
          </Button>
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

      {/* Image */}
      {field.type === 'image' && (
        <div className="space-y-3">
          <div className="rounded-lg border border-dashed bg-muted/30 p-3">
            {value ? (
              <img
                src={value}
                alt={field.label || 'Selected image'}
                className="h-44 w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex h-44 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  No image selected
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setIsImagePickerOpen(true)
            }
          >
            <ImageIcon className="h-4 w-4" />
            Choose image
          </Button>

          <GitHubImagePickerModal
            open={isImagePickerOpen}
            onClose={() =>
              setIsImagePickerOpen(false)
            }
            onSelect={(imageUrl) => {
              handleChange(imageUrl)
              setIsImagePickerOpen(false)
            }}
          />
        </div>
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
