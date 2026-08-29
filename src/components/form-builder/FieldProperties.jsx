import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

function FieldProperties({
  field,
  onChange,
}) {
  if (!field) {
    return (
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Select a field to edit its properties.
      </div>
    )
  }

  function updateField(property, value) {
    onChange({
      ...field,
      [property]: value,
    })
  }

  return (
    <div className="mt-6 space-y-6">

      {/* Type */}
      <div className="space-y-2">
        <Label>
          Field Type
        </Label>

        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
          {field.type}
        </div>
      </div>

      {/* Label */}
      <div className="space-y-2">
        <Label htmlFor="field-label">
          Label
        </Label>

        <Input
          id="field-label"
          value={field.label}
          onChange={(event) =>
            updateField(
              'label',
              event.target.value
            )
          }
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="field-name">
          Name
        </Label>

        <Input
          id="field-name"
          value={field.name}
          onChange={(event) =>
            updateField(
              'name',
              event.target.value
            )
          }
        />

        <p className="text-xs text-muted-foreground">
          Used as the field name when submitting the form.
        </p>
      </div>

      {/* Placeholder */}
      <div className="space-y-2">
        <Label htmlFor="field-placeholder">
          Placeholder
        </Label>

        <Input
          id="field-placeholder"
          value={field.placeholder ?? ''}
          onChange={(event) =>
            updateField(
              'placeholder',
              event.target.value
            )
          }
        />
      </div>

      {/* Required */}
      <div className="flex items-center justify-between rounded-lg border p-4">

        <div>
          <Label>
            Required
          </Label>

          <p className="text-xs text-muted-foreground">
            User must complete this field.
          </p>
        </div>

        <Switch
          checked={field.required}
          onCheckedChange={(value) =>
            updateField(
              'required',
              value
            )
          }
        />

      </div>

    </div>
  )
}

export default FieldProperties