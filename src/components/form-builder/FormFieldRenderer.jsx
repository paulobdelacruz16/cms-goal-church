import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function FormFieldRenderer({ field }) {
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

      {field.type === 'email' && (
        <Input
          id={inputId}
          type="email"
          placeholder={field.placeholder || ''}
          disabled
        />
      )}

      {field.type === 'text' && (
        <Input
          id={inputId}
          type="text"
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

      {field.type !== 'text' &&
        field.type !== 'email' &&
        field.type !== 'number' && (
          <Input
            id={inputId}
            type="text"
            placeholder={field.placeholder || ''}
            disabled
          />
        )}

    </div>
  )
}

export default FormFieldRenderer