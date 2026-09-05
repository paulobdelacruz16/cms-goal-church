import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { FIELD_TYPES } from '@/lib/form-fields'

function FieldRenderer({ field }) {
  switch (field.type) {
    case FIELD_TYPES.TEXT:
      return (
        <Input
          type="text"
          placeholder={field.placeholder || ''}
          disabled
        />
      )

    case FIELD_TYPES.TEXTAREA:
      return (
        <Textarea
          placeholder={field.placeholder || ''}
          disabled
        />
      )

    case FIELD_TYPES.SELECT:
      return (
        <select
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

    case FIELD_TYPES.RADIO:
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="radio"
                disabled
              />

              {option.label}
            </label>
          ))}
        </div>
      )

    case FIELD_TYPES.CHECKBOX:
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            disabled
          />

          {field.label}
        </label>
      )

    case FIELD_TYPES.GROUP:
      return (
        <div className="rounded-md border border-dashed bg-muted/30 p-3">
          <div className="mb-2 text-sm font-medium">
            {field.label}
          </div>
          <div className="rounded-md border border-dashed bg-background/50 p-2 text-xs text-muted-foreground">
            Group container
          </div>
        </div>
      )

    case FIELD_TYPES.IMAGE:
      return (
        <div className="rounded-md border border-dashed bg-muted/30 p-3">
          <div className="flex h-24 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
            Image field
          </div>
        </div>
      )

    default:
      return null
  }
}

export default FieldRenderer
