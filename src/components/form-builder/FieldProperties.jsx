import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react'

import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core'

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'


function SortableOption({
  option,
  index,
  onLabelChange,
  onValueChange,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: option.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border p-3"
    >

      {/* Option Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            title="Move option"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <Label>
            Option {index + 1}
          </Label>

        </div>

        {/* Delete */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(index)}
          title="Delete option"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

      </div>

      {/* Option Fields */}
      <div className="mt-3 space-y-3">

        {/* Label */}
        <div>
          <Label className="text-xs">
            Label
          </Label>

          <Input
            value={option.label || ''}
            onChange={(event) =>
              onLabelChange(
                index,
                event.target.value
              )
            }
          />
        </div>

        {/* Value */}
        <div>
          <Label className="text-xs">
            Value
          </Label>

          <Input
            value={option.value || ''}
            onChange={(event) =>
              onValueChange(
                index,
                event.target.value
              )
            }
          />
        </div>

      </div>

    </div>
  )
}


function FieldProperties({
  field,
  onChange,
}) {
  const [showAdvanced, setShowAdvanced] =
    useState(false)

  if (!field) {
    return (
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Select a field to edit its properties.
      </div>
    )
  }

  /*
   * Normalize options so every option
   * has a stable ID.
   *
   * Existing options from the API may not
   * have an ID yet.
   */
  const options = (field.options || []).map(
    (option, index) => ({
      ...option,
      id: option.id || `option_${index}`,
    })
  )

  function updateField(property, value) {
    onChange({
      ...field,
      [property]: value,
    })
  }

  /*
   * Convert label into a usable value.
   *
   * Example:
   *
   * "General Members"
   *       ↓
   * "general-members"
   */
  function createOptionValue(label) {
    return label
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
  }

  /*
   * Handle changing an option label.
   *
   * The value will automatically change
   * ONLY if the user hasn't manually
   * changed the value.
   */
  function handleOptionLabelChange(
    index,
    value
  ) {
    const currentOptions = [
      ...(field.options || []),
    ]

    const currentOption =
      currentOptions[index]

    const previousGeneratedValue =
      createOptionValue(
        currentOption.label
      )

    const newGeneratedValue =
      createOptionValue(value)

    const shouldAutoUpdateValue =
      currentOption.value ===
      previousGeneratedValue ||
      !currentOption.value

    currentOptions[index] = {
      ...currentOption,

      label: value,

      ...(shouldAutoUpdateValue
        ? {
            value: newGeneratedValue,
          }
        : {}),
    }

    updateField(
      'options',
      currentOptions
    )
  }

  /*
   * Handle manually changing
   * the option value.
   */
  function handleOptionValueChange(
    index,
    value
  ) {
    const currentOptions = [
      ...(field.options || []),
    ]

    currentOptions[index] = {
      ...currentOptions[index],
      value,
    }

    updateField(
      'options',
      currentOptions
    )
  }

  /*
   * Add a new option.
   */
  function handleAddOption() {
    const currentOptions = [
      ...(field.options || []),
    ]

    const optionNumber =
      currentOptions.length + 1

    currentOptions.push({
      id: `option_${crypto.randomUUID()}`,
      label: `Option ${optionNumber}`,
      value: `option-${optionNumber}`,
    })

    updateField(
      'options',
      currentOptions
    )
  }

  /*
   * Delete an option.
   */
  function handleDeleteOption(index) {
    const currentOptions = [
      ...(field.options || []),
    ]

    currentOptions.splice(index, 1)

    updateField(
      'options',
      currentOptions
    )
  }

  /*
   * Reorder options.
   */
  function handleOptionDragEnd(event) {
    const {
      active,
      over,
    } = event

    if (
      !over ||
      active.id === over.id
    ) {
      return
    }

    const oldIndex =
      options.findIndex(
        (option) =>
          option.id === active.id
      )

    const newIndex =
      options.findIndex(
        (option) =>
          option.id === over.id
      )

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return
    }

    const reorderedOptions =
      arrayMove(
        options,
        oldIndex,
        newIndex
      )

    updateField(
      'options',
      reorderedOptions
    )
  }

  return (
    <div className="mt-6 space-y-6">

      {/* ========================= */}
      {/* Basic Properties */}
      {/* ========================= */}

      {/* Field Label */}
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

      {/* Field Name */}
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


      {/* ========================= */}
      {/* Advanced */}
      {/* ========================= */}

      <div className="border-t pt-4">

        <button
          type="button"
          onClick={() =>
            setShowAdvanced(
              (current) => !current
            )
          }
          className="flex w-full items-center justify-between text-sm font-medium hover:text-foreground"
        >

          <span>
            Advanced
          </span>

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showAdvanced
                ? 'rotate-180'
                : ''
            }`}
          />

        </button>

        {showAdvanced && (
          <div className="mt-5 space-y-6">

            {/* Placeholder */}
            {field.type !== 'checkbox' &&
              field.type !== 'radio' && (
                <div className="space-y-2">

                  <Label htmlFor="field-placeholder">
                    Placeholder
                  </Label>

                  <Input
                    id="field-placeholder"
                    value={
                      field.placeholder || ''
                    }
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
                checked={Boolean(
                  field.required
                )}
                onCheckedChange={(value) =>
                  updateField(
                    'required',
                    value
                  )
                }
              />

            </div>

            {/* Validation */}
            {(
              field.type === 'text' ||
              field.type === 'textarea'
            ) && (
              <div className="space-y-4">

                <div>
                  <h3 className="text-sm font-semibold">
                    Validation
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Configure validation rules for this field.
                  </p>
                </div>

                {/* Minimum Length */}
                <div className="space-y-2">

                  <Label htmlFor="field-min-length">
                    Minimum Length
                  </Label>

                  <Input
                    id="field-min-length"
                    type="number"
                    min="0"
                    value={
                      field.validation?.minLength ?? ''
                    }
                    onChange={(event) => {
                      const value =
                        event.target.value

                      updateField(
                        'validation',
                        {
                          ...(field.validation || {}),
                          minLength:
                            value === ''
                              ? undefined
                              : Number(value),
                        }
                      )
                    }}
                  />

                </div>

                {/* Maximum Length */}
                <div className="space-y-2">

                  <Label htmlFor="field-max-length">
                    Maximum Length
                  </Label>

                  <Input
                    id="field-max-length"
                    type="number"
                    min="0"
                    value={
                      field.validation?.maxLength ?? ''
                    }
                    onChange={(event) => {
                      const value =
                        event.target.value

                      updateField(
                        'validation',
                        {
                          ...(field.validation || {}),
                          maxLength:
                            value === ''
                              ? undefined
                              : Number(value),
                        }
                      )
                    }}
                  />

                </div>

              </div>
            )}

            {/* Validation Error Message */}
            {field.required && (
              <div className="space-y-2">

                <Label htmlFor="field-error-message">
                  Error Message
                </Label>

                <Input
                  id="field-error-message"
                  value={
                    field.validation?.message || ''
                  }
                  placeholder="This field is required."
                  onChange={(event) => {
                    updateField(
                      'validation',
                      {
                        ...(field.validation || {}),
                        message:
                          event.target.value,
                      }
                    )
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  Message shown when this field fails validation.
                </p>

              </div>
            )}

          </div>
        )}

      </div>


      {/* ========================= */}
      {/* Options */}
      {/* ========================= */}

      {(field.type === 'select' ||
        field.type === 'radio') && (
        <div className="mt-6 space-y-4 border-t pt-6">

          {/* Options Header */}
          <div>

            <h3 className="text-sm font-semibold">
              Options
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add and edit the choices for this field.
            </p>

          </div>

          {/* Sortable Options */}
          <DndContext
            collisionDetection={
              closestCenter
            }
            onDragEnd={
              handleOptionDragEnd
            }
          >

            <SortableContext
              items={options.map(
                (option) =>
                  option.id
              )}
              strategy={
                verticalListSortingStrategy
              }
            >

              <div className="space-y-3">

                {options.map(
                  (option, index) => (
                    <SortableOption
                      key={option.id}
                      option={option}
                      index={index}
                      onLabelChange={
                        handleOptionLabelChange
                      }
                      onValueChange={
                        handleOptionValueChange
                      }
                      onDelete={
                        handleDeleteOption
                      }
                    />
                  )
                )}

              </div>

            </SortableContext>

          </DndContext>

          {/* Add Option */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={
              handleAddOption
            }
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