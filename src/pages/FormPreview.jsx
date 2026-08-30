import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getDynamicPageContentById } from '@/api/dynamicPageContent'

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
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function FormPreview() {
  const { id } = useParams()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true)
        setError(null)

        const data =
          await getDynamicPageContentById(id)

        setForm(data)
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
          </div>

          <Button asChild variant="outline">
            <Link to={`/forms/${form._id}/edit`}>
              <ArrowLeft />
              Back to Builder
            </Link>
          </Button>

        </div>

        {/* Form */}
        <div className="rounded-xl border bg-background p-6 shadow-sm md:p-8">

          <div className="space-y-6">

            {form.fields?.length > 0 ? (
              form.fields.map((field) => (
                <PreviewField
                  key={field.id}
                  field={field}
                />
              ))
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                This form has no fields yet.
              </div>
            )}

          </div>

          {/* Submit */}
          {form.fields?.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <Button disabled>
                Submit
              </Button>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

function PreviewField({ field }) {
  const inputId = `preview-${field.id}`

  return (
    <div className="space-y-2">

      <Label htmlFor={inputId}>
        {field.label}

        {field.required && (
          <span className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>

      {field.type === 'text' && (
        <Input
          id={inputId}
          type="text"
          placeholder={field.placeholder || ''}
          disabled
        />
      )}

      {field.type === 'email' && (
        <Input
          id={inputId}
          type="email"
          placeholder={field.placeholder || ''}
          disabled
        />
      )}

      {field.type === 'number' && (
        <Input
          id={inputId}
          type="number"
          placeholder={field.placeholder || ''}
          disabled
        />
      )}

      {field.type === 'textarea' && (
        <Textarea
          id={inputId}
          placeholder={field.placeholder || ''}
          disabled
        />
      )}

      {field.type === 'select' && (
        <Select disabled>
          <SelectTrigger id={inputId}>
            <SelectValue placeholder={field.placeholder || 'Select an option'} />
          </SelectTrigger>

          <SelectContent>
            {(field.options || []).map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === 'radio' && (
        <RadioGroup disabled>
          {(field.options || []).map((option) => (
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
          ))}
        </RadioGroup>
      )}

      {field.type === 'checkbox' && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={inputId}
            disabled
          />

          <Label htmlFor={inputId}>
            {field.label}
          </Label>
        </div>
      )}

      {field.type === 'date' && (
        <Input
          id={inputId}
          type="date"
          disabled
        />
      )}

    </div>
  )
}



export default FormPreview