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
  const [selectedFieldId, setSelectedFieldId] = useState(null)
  const [formName, setFormName] = useState('Untitled Form')
  const [formSlug, setFormSlug] = useState('untitled-form')
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
  }


  function handleDragStart(event) {
    const { active } = event

    const type = active.data.current?.type

    if (type !== 'palette-field') {
      return
    }

    setActiveField(
      active.data.current.fieldType
    )
  }

  function handleDragCancel() {
    setActiveField(null)
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

    <div className="flex min-h-[calc(100vh-7.5rem)] flex-col lg:h-[calc(100vh-2rem)]">

      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b">

        <div className="flex items-center gap-4">

          <Link
            to="/forms"
            className={buttonVariants({
              variant: 'ghost',
              size: 'icon',
            })}
          >
            <ArrowLeft />
          </Link>

          <div>
            <h1 className="font-semibold">
              {id ? 'Edit Form' : 'New Form'}
            </h1>

            <p className="text-xs text-muted-foreground">
              Form Builder
            </p>
          </div>

        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
        >
          <Save />

          {saving
            ? 'Saving...'
            : 'Save Form'}
        </Button>

      </header>

      {/* Builder */}
      <DndContext
        sensors={sensors}
        collisionDetection={
          formBuilderCollisionDetection
        }
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >

        <section className="border-b p-4">
          <FieldPalette />
        </section>

        <div className="grid grid-cols-1 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_280px]">

          {/* Canvas */}
          <main className="min-w-0 bg-[#f0f4f8] p-4 lg:overflow-y-auto lg:p-8">

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
          <aside className="min-w-0 overflow-x-hidden border-t p-4 lg:overflow-y-auto lg:border-t-0 lg:border-l">

            <h2 className="text-sm font-semibold">
              Form Settings
            </h2>

            {/* Form Name + Slug */}
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

            {/* Other Form Settings */}
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

            {/* Field Properties */}
            {selectedField && (
              <div className="mt-8 border-t pt-6">

                <h2 className="text-sm font-semibold">
                  Field Properties
                </h2>

                <FieldProperties
                  field={selectedField}
                  onChange={handleFieldChange}
                />

              </div>
            )}

          </aside>

        </div>
        <DragOverlay>
          {activeField ? (
            <div className="w-48 rounded-lg border bg-background p-3 text-sm font-medium shadow-lg">
              {activeField}
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>

    </div>
  )
}

export default FormBuilder
