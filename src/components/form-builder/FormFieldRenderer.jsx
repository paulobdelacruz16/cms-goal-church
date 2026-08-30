import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'



function FormFieldRenderer({ field }) {
  const inputId = `preview-${field.id}`

  function renderField() {
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={inputId}
            type="text"
            placeholder={field.placeholder || ''}
            disabled
          />
        )

      case 'email':
        return (
          <Input
            id={inputId}
            type="email"
            placeholder={field.placeholder || ''}
            disabled
          />
        )

      case 'number':
        return (
          <Input
            id={inputId}
            type="number"
            placeholder={field.placeholder || ''}
            disabled
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={inputId}
            placeholder={field.placeholder || ''}
            disabled
          />
        )

      case 'date':
        return (
          <Input
            id={inputId}
            type="date"
            disabled
          />
        )

      case 'select':
        return (
          <select
            id={inputId}
            disabled
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  disabled
                />

                {option.label}
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              id={inputId}
              type="checkbox"
              disabled
            />

            <span className="text-sm">
              {field.label}
            </span>
          </div>
        )

      default:
        return (
          <Input
            id={inputId}
            type="text"
            placeholder={field.placeholder || ''}
            disabled
          />
        )
    }
  }

  return (
    <div className="space-y-2">

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

      {renderField()}

    </div>
  )
}

export default FormFieldRenderer