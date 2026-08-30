import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

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

  function handleOptionChange(
    index,
    property,
    value
  ) {
    const options = [...(field.options || [])]

    options[index] = {
      ...options[index],
      [property]: value,
    }

    updateField('options', options)
  }

  function handleAddOption() {
    const options = [
      ...(field.options || []),
    ]

    const optionNumber =
      options.length + 1

    options.push({
      label: `Option ${optionNumber}`,
      value: `option-${optionNumber}`,
    })

    updateField('options', options)
  }

  function handleDeleteOption(index) {
    const options = [
      ...(field.options || []),
    ]

    options.splice(index, 1)

    updateField('options', options)
  }

  return (
    <div className="mt-6 space-y-6">

      {/* Label */}
      <div className="space-y-2">
        <Label htmlFor="field-label">
          Label
        </Label>

        <Input
          id="field-label"
          value={field.label || ''}
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
          value={field.name || ''}
          onChange={(event) =>
            updateField(
              'name',
              event.target.value
            )
          }
        />
      </div>

      {/* Placeholder */}
      {field.type !== 'checkbox' &&
        field.type !== 'radio' && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder">
              Placeholder
            </Label>

            <Input
              id="field-placeholder"
              value={field.placeholder || ''}
              onChange={(event) =>
                updateField(
                  'placeholder',
                  event.target.value
                )
              }
            />
          </div>
        )}

      {/* Required */}
      <div className="flex items-center justify-between">
        <Label htmlFor="field-required">
          Required
        </Label>

        <Switch
          id="field-required"
          checked={Boolean(field.required)}
          onCheckedChange={(value) =>
            updateField(
              'required',
              value
            )
          }
        />
      </div>

      {/* Options */}
      {(field.type === 'select' ||
        field.type === 'radio') && (
        <div className="space-y-4">

          <div>
            <h3 className="text-sm font-medium">
              Options
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add and edit the choices available to users.
            </p>
          </div>

          <div className="space-y-3">

            {(field.options || []).map(
              (option, index) => (
                <div
                  key={`${field.id}-${index}`}
                  className="flex items-center gap-2"
                >

                  <Input
                    value={option.label}
                    onChange={(event) =>
                      handleOptionChange(
                        index,
                        'label',
                        event.target.value
                      )
                    }
                    placeholder="Label"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeleteOption(index)
                    }
                    className="shrink-0"
                  >
                    ×
                  </Button>

                </div>
              )
            )}

          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddOption}
          >
            + Add Option
          </Button>

        </div>
      )}

    </div>
  )
}

export default FieldProperties