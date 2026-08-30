import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

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

  function createOptionValue(label) {
    return label
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
  }

  function handleOptionLabelChange(index, value) {
    const options = [...(field.options || [])]

    const currentOption = options[index]

    const previousGeneratedValue =
      createOptionValue(currentOption.label)

    const newGeneratedValue =
      createOptionValue(value)

    const shouldAutoUpdateValue =
      currentOption.value === previousGeneratedValue ||
      currentOption.value === '' ||
      !currentOption.value

    options[index] = {
      ...currentOption,
      label: value,
      ...(shouldAutoUpdateValue
        ? {
            value: newGeneratedValue,
          }
        : {}),
    }

    updateField('options', options)
  }

  function handleOptionValueChange(index, value) {
    const options = [...(field.options || [])]

    options[index] = {
      ...options[index],
      value,
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
        <div className="mt-6 space-y-4">

          <div>
            <h3 className="text-sm font-semibold">
              Options
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add and edit the choices for this field.
            </p>
          </div>

          <div className="space-y-3">

            {(field.options || []).map(
              (option, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-3"
                >

                  <div className="flex items-center justify-between">

                    <Label>
                      Option {index + 1}
                    </Label>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteOption(index)
                      }
                      title="Delete option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </div>

                  <div className="mt-3 space-y-3">

                    {/* Option Label */}
                    <div>
                      <Label className="text-xs">
                        Label
                      </Label>

                      <Input
                        value={option.label || ''}
                        onChange={(event) =>
                          handleOptionLabelChange(
                            index,
                            event.target.value
                          )
                        }
                      />
                    </div>

                    {/* Option Value */}
                    <div>
                      <Label className="text-xs">
                        Value
                      </Label>

                      <Input
                        value={option.value || ''}
                        onChange={(event) =>
                          handleOptionValueChange(
                            index,
                            event.target.value
                          )
                        }
                      />
                    </div>

                  </div>

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
            <Plus />
            Add Option
          </Button>

        </div>
      )}

    </div>
  )
}

export default FieldProperties