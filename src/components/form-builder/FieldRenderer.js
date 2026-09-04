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

    default:
      return null
  }
}

export default FieldRenderer
