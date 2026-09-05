import { useState, useEffect } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
} from '@dnd-kit/sortable'

import {
  Button,
  buttonVariants,
} from '@/components/ui/button'

import { createField } from '@/lib/form-fields'

import FieldPalette from '@/components/form-builder/FieldPalette'
import FormCanvas from '@/components/form-builder/FormCanvas'
import FieldProperties from '@/components/form-builder/FieldProperties'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useParams } from 'react-router-dom'
// import { createDynamicPageContent } from '@/api/dynamicPageContent'
import { useCreateFormTemplate, useUpdateFormTemplate, useFormTemplateById } from '@/hooks/useFormTemplate'
import FormSettings from '@/components/form-builder/FormSettings'

function formBuilderCollisionDetection(args) {
  const activeType =
    args.active.data.current?.type

  /*
   * New palette fields need to target the Repeatable that contains
   * the pointer before considering its nested sortable fields or the
   * enclosing canvas. Existing fields retain the current sorting
   * collision behavior.
   */
  if (activeType !== 'palette-field') {
    return closestCenter(args)
  }

  const pointerCollisions =
    pointerWithin(args)

  const repeatableCollisions = pointerCollisions.filter(
    (collision) =>
      collision.data.droppableContainer
        .data.current?.type ===
      'repeatable-container'
  )

  if (repeatableCollisions.length > 0) {
    return repeatableCollisions
  }

  const canvasCollision = pointerCollisions.find(
    (collision) => collision.id === 'form-canvas'
  )

  /*
   * In the canvas's empty space, use the canvas itself as the target
   * so a palette field is appended instead of being inserted before
   * the nearest existing field.
   */
  if (pointerCollisions.length === 1 && canvasCollision) {
    return [canvasCollision]
  }

  return closestCenter(args)
}

function FormBuilder() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const [fields, setFields] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [selectedFieldId, setSelectedFieldId] = useState(null)
  const [formName, setFormName] = useState('Untitled Form')
  const [formSlug, setFormSlug] = useState('untitled-form')
  const [sidebarMode, setSidebarMode] = useState('form')
  const selectedField = fields
    .flatMap((field) =>
      field.type === 'repeatable'
        ? [field, ...(field.fields || [])]
        : [field]
    )
    .find(
      (field) =>
        field.id === selectedFieldId
    )
  const createMutation = useCreateFormTemplate()
  const updateMutation = useUpdateFormTemplate()
  const { id } = useParams()
  const {
    data: existingForm,
    isLoading: isLoadingForm,
    isError: isFormError,
  } = useFormTemplateById(id)

  const saving = createMutation.isPending || updateMutation.isPending
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const [formDescription, setFormDescription] = useState(
    'Build your form below.'
  )
  const [submitButtonText, setSubmitButtonText] = useState('Submit')
  const [successMessage, setSuccessMessage] = useState(
    'Thank you! Your response has been submitted.'
  )




  useEffect(() => {
    if (!existingForm) {
      return
    }

    setFormName(existingForm.name || '')
    setFormSlug(existingForm.slug || '')
    setFields(existingForm.fields || [])
  }, [existingForm])

  function generateSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  function handleFormNameChange(value) {
    setFormName(value)

    if (!slugManuallyEdited) {
      setFormSlug(generateSlug(value))
    }
  }

  function handleFormSlugChange(value) {
    setSlugManuallyEdited(true)
    setFormSlug(value)
  }

  async function handleSave() {
    const formData = {
      name: formName,
      slug: formSlug,
      description: formDescription,
      submitButtonText,
      successMessage,
      fields,
    }

    try {
      if (id) {
        const result =
          await updateMutation.mutateAsync({
            id,
            data: formData,
          })

        console.log(
          'Form updated:',
          result
        )

        return
      }

      const result =
        await createMutation.mutateAsync(
          formData
        )

      console.log(
        'Form created:',
        result
      )

    } catch (error) {
      console.error(
        'Failed to save form:',
        error
      )
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event

    setActiveField(null)

    if (!over) {
      return
    }

    const activeType =
      active.data.current?.type

    const overType =
      over.data.current?.type

    /*
     * ========================================
     * NEW FIELD FROM PALETTE
     * ========================================
     */
    if (activeType === 'palette-field') {
      const fieldType =
        active.data.current?.fieldType

      if (!fieldType) {
        return
      }

      const newField =
        createField(fieldType)

      /*
       * Dropped into Repeatable Container
       */
      if (
        overType ===
        'repeatable-container'
      ) {
        const repeatableId =
          over.data.current?.fieldId

        if (!repeatableId) {
          return
        }

        setFields(
          (currentFields) =>
            currentFields.map(
              (field) => {
                if (
                  field.id !==
                  repeatableId
                ) {
                  return field
                }

                return {
                  ...field,

                  fields: [
                    ...(field.fields || []),
                    newField,
                  ],
                }
              }
            )
        )

        return
      }

      /*
       * Dropped into normal canvas
       */
      setFields((currentFields) => {

        // Empty canvas
        if (
          over.id ===
          'form-canvas'
        ) {
          return [
            ...currentFields,
            newField,
          ]
        }

        // Dropped on existing field
        const overIndex =
          currentFields.findIndex(
            (field) =>
              field.id === over.id
          )

        if (overIndex === -1) {
          return currentFields
        }

        const newFields = [
          ...currentFields,
        ]

        newFields.splice(
          overIndex,
          0,
          newField
        )

        return newFields
      })

      return
    }

    /*
     * ========================================
     * EXISTING FIELD
     * ========================================
     */

    if (
      activeType ===
      'repeatable-container'
    ) {
      /*
       * Don't allow a repeatable
       * container to be dropped
       * inside itself.
       */
      if (
        over.id ===
        `repeatable-${active.id}`
      ) {
        return
      }
    }

    /*
     * Don't currently move existing
     * fields between containers.
     *
     * Existing fields only reorder
     * within their current level.
     */
    setFields(
      (currentFields) => {

        const activeId =
          active.id

        const overId =
          over.id

        /*
         * Top-level reorder
         */
        const oldIndex =
          currentFields.findIndex(
            (field) =>
              field.id === activeId
          )

        const newIndex =
          currentFields.findIndex(
            (field) =>
              field.id === overId
          )

        if (
          oldIndex !== -1 &&
          newIndex !== -1
        ) {
          return arrayMove(
            currentFields,
            oldIndex,
            newIndex
          )
        }

        /*
         * Nested reorder
         */
        return currentFields.map(
          (field) => {

            if (
              field.type !==
              'repeatable'
            ) {
              return field
            }

            const nestedFields =
              field.fields || []

            const nestedOldIndex =
              nestedFields.findIndex(
                (nestedField) =>
                  nestedField.id ===
                  activeId
              )

            const nestedNewIndex =
              nestedFields.findIndex(
                (nestedField) =>
                  nestedField.id ===
                  overId
              )

            if (
              nestedOldIndex === -1 ||
              nestedNewIndex === -1
            ) {
              return field
            }

            return {
              ...field,

              fields: arrayMove(
                nestedFields,
                nestedOldIndex,
                nestedNewIndex
              ),
            }
          }
        )
      }
    )
  }

  function handleFieldDelete(id) {
    setFields((currentFields) =>
      currentFields
        .filter((field) => field.id !== id)
        .map((field) => {
          if (field.type !== 'repeatable') {
            return field
          }

          return {
            ...field,
            fields: (field.fields || []).filter(
              (nestedField) =>
                nestedField.id !== id
            ),
          }
        })
    )

    if (selectedFieldId === id) {
      setSelectedFieldId(null)
    }
  }

  function handleFieldDuplicate(id) {
    setFields((currentFields) => {
      // Top-level field
      const topLevelIndex =
        currentFields.findIndex(
          (field) => field.id === id
        )

      if (topLevelIndex !== -1) {
        const original =
          currentFields[topLevelIndex]

        const duplicate = {
          ...original,
          id: `field_${crypto.randomUUID()}`,
          name: `${original.name}_copy`,
          label: `${original.label} Copy`,
        }

        const newFields = [
          ...currentFields,
        ]

        newFields.splice(
          topLevelIndex + 1,
          0,
          duplicate
        )

        return newFields
      }

      // Nested field
      return currentFields.map(
        (field) => {
          if (field.type !== 'repeatable') {
            return field
          }

          const nestedIndex =
            (field.fields || []).findIndex(
              (nestedField) =>
                nestedField.id === id
            )

          if (nestedIndex === -1) {
            return field
          }

          const original =
            field.fields[nestedIndex]

          const duplicate = {
            ...original,
            id: `field_${crypto.randomUUID()}`,
            name: `${original.name}_copy`,
            label: `${original.label} Copy`,
          }

          const nestedFields = [
            ...(field.fields || []),
          ]

          nestedFields.splice(
            nestedIndex + 1,
            0,
            duplicate
          )

          return {
            ...field,
            fields: nestedFields,
          }
        }
      )
    })
  }

  function handleFieldChange(updatedField) {
    setFields((currentFields) =>
      currentFields.map((field) => {

        // Top-level field
        if (field.id === updatedField.id) {
          return updatedField
        }

        // Nested field
        if (field.type === 'repeatable') {
          return {
            ...field,
            fields: (field.fields || []).map(
              (nestedField) =>
                nestedField.id ===
                  updatedField.id
                  ? updatedField
                  : nestedField
            ),
          }
        }

        return field
      })
    )
  }

  function handleFieldSelect(id) {
    setSelectedFieldId(id)
    setSidebarMode('field')
  }

  function handleAddField(type) {
    const newField = createField(type)

    setFields((currentFields) => [
      ...currentFields,
      newField,
    ])
  }

  function handleFormSettingsClick() {
    setSelectedFieldId(null)
    setSidebarMode('form')
  }


  function handleDragStart(event) {
    const { active, activatorEvent } = event

    if (active?.data?.current?.type !== 'palette-field') {
      return
    }

    setActiveField(active.data.current.fieldType)

    if (activatorEvent) {
      setDragPosition({
        x: activatorEvent.clientX,
        y: activatorEvent.clientY,
      })
    }
  }

  function handleDragMove(event) {
    if (!event?.activatorEvent) {
      return
    }

    setDragPosition({
      x: event.activatorEvent.clientX,
      y: event.activatorEvent.clientY,
    })
  }

  function handleDragCancel() {
    setActiveField(null)
    setDragPosition({ x: 0, y: 0 })
  }

  if (id && isLoadingForm) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading form...
      </div>
    )
  }

  if (id && isFormError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Failed to load form.
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-7.5rem)] flex-col lg:h-[calc(100vh-4rem)]">

      <DndContext
        sensors={sensors}
        collisionDetection={formBuilderCollisionDetection}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >

        {/* Field Toolbar */}
        <section className="shrink-0 border-b bg-background p-4">

          {/* Desktop */}
          <div className="hidden items-center gap-4 rounded-lg border-2 border-dashed p-2 lg:flex">
            {/* Add Field */}
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-semibold text-blue-600">
                Add Field
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Drag or click to add to form
              </p>
            </div>

            {/* Field Palette */}
            <div className="min-w-0 flex-1">
              <FieldPalette onAddField={handleAddField} />
            </div>

            {/* Save Form */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="shrink-0 gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Form'}
            </Button>

          </div>

          {/* Mobile */}
          <div className="space-y-2 lg:hidden">

            {/* Add Field + Save Form */}
            <div className="flex w-full items-center justify-between rounded-lg border-2 border-dashed p-3">

              <div>
                <h3 className="text-sm font-semibold text-blue-600">
                  Add Field
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Drag or click to add to form
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="shrink-0 gap-2 bg-foreground text-background hover:bg-foreground/90"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Form'}
              </Button>

            </div>

            {/* Field Palette */}
            <div className="w-full rounded-lg border-2 border-dashed p-2">
              <FieldPalette onAddField={handleAddField} />
            </div>
          </div>
        </section>


        {/* Builder */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">

          {/* Canvas */}
          <main className="min-w-0 overflow-y-auto bg-[#f0f4f8] p-4 lg:p-8">

            <div className="mx-auto min-h-full max-w-2xl">

              <div className="rounded-xl border bg-background p-4 shadow-sm md:p-8">

                <h2 className="text-2xl font-bold">
                  {formName}
                </h2>

                {formDescription && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formDescription}
                  </p>
                )}

                <div className="mt-8">
                  <FormCanvas
                    fields={fields}
                    selectedFieldId={selectedFieldId}
                    onFieldSelect={handleFieldSelect}
                    onDelete={handleFieldDelete}
                    onDuplicate={handleFieldDuplicate}
                  />
                </div>

              </div>

            </div>

          </main>


          {/* Properties */}
          <aside className="min-w-0 overflow-x-hidden border-t bg-background p-4 lg:overflow-y-auto lg:border-t-0 lg:border-l">

            {sidebarMode === 'form' ? (
              <>
                <h2 className="text-sm font-semibold">
                  Form Settings
                </h2>

                <div className="mt-6 space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="form-name">
                      Form Name
                    </Label>

                    <Input
                      id="form-name"
                      value={formName}
                      onChange={(event) =>
                        handleFormNameChange(
                          event.target.value
                        )
                      }
                      placeholder="Contact Form"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form-slug">
                      Slug
                    </Label>

                    <Input
                      id="form-slug"
                      value={formSlug}
                      onChange={(event) =>
                        handleFormSlugChange(
                          event.target.value
                        )
                      }
                      placeholder="contact-form"
                    />
                  </div>

                </div>

                <FormSettings
                  formDescription={formDescription}
                  submitButtonText={submitButtonText}
                  successMessage={successMessage}
                  onFormDescriptionChange={
                    setFormDescription
                  }
                  onSubmitButtonTextChange={
                    setSubmitButtonText
                  }
                  onSuccessMessageChange={
                    setSuccessMessage
                  }
                />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFormSettingsClick}
                  className="-ml-2 mb-4"
                >
                  ← Form Settings
                </Button>

                <h2 className="text-sm font-semibold">
                  Field Properties
                </h2>

                {selectedField && (
                  <FieldProperties
                    field={selectedField}
                    onChange={handleFieldChange}
                  />
                )}
              </>
            )}

          </aside>

        </div>

        <DragOverlay dropAnimation={null}>
          {activeField ? (
            <div
              className="w-48 rounded-lg border bg-background p-3 text-sm font-medium shadow-lg"
              style={{
                position: 'fixed',
                left: dragPosition.x,
                top: dragPosition.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 60,
              }}
            >
              {activeField}
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>

    </div>
  )
}

export default FormBuilder
