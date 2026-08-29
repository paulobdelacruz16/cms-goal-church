import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core'
import {
  arrayMove,
} from '@dnd-kit/sortable'

import { Button } from '@/components/ui/button'

import { createField } from '@/lib/form-fields'

import FieldPalette from '@/components/form-builder/FieldPalette'
import FormCanvas from '@/components/form-builder/FormCanvas'
import FieldProperties from '@/components/form-builder/FieldProperties'

function FormBuilder() {
  const [fields, setFields] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [selectedFieldId, setSelectedFieldId] = useState(null)

  const selectedField = fields.find(
    (field) => field.id === selectedFieldId
  );

  function handleDragEnd(event) {
    const { active, over } = event

    setActiveField(null)

    if (!over) {
      return
    }

    const activeType = active.data.current?.type

    // New field from palette
    if (activeType === 'palette-field') {
      const fieldType = active.data.current?.fieldType

      if (!fieldType) {
        return
      }

      const newField = createField(fieldType)

      setFields((currentFields) => {
        // Empty canvas
        if (over.id === 'form-canvas') {
          return [
            ...currentFields,
            newField,
          ]
        }

        // Dropped on an existing field
        const overIndex = currentFields.findIndex(
          (field) => field.id === over.id
        )

        if (overIndex === -1) {
          return currentFields
        }

        const newFields = [...currentFields]

        newFields.splice(
          overIndex,
          0,
          newField
        )

        return newFields
      })

      return
    }

    // Reorder existing fields
    if (active.id !== over.id) {
      setFields((currentFields) => {
        const oldIndex = currentFields.findIndex(
          (field) => field.id === active.id
        )

        const newIndex = currentFields.findIndex(
          (field) => field.id === over.id
        )

        if (
          oldIndex === -1 ||
          newIndex === -1
        ) {
          return currentFields
        }

        return arrayMove(
          currentFields,
          oldIndex,
          newIndex
        )
      })
    }
  }

  function handleFieldDelete(id) {
    setFields((currentFields) =>
      currentFields.filter(
        (field) => field.id !== id
      )
    )

    if (selectedFieldId === id) {
      setSelectedFieldId(null)
    }
  }

  function handleFieldDuplicate(id) {
    setFields((currentFields) => {
      const index = currentFields.findIndex(
        (field) => field.id === id
      )

      if (index === -1) {
        return currentFields
      }

      const original = currentFields[index]

      const duplicate = {
        ...original,
        id: `field_${crypto.randomUUID()}`,
        name: `${original.name}_copy`,
        label: `${original.label} Copy`,
      }

      const newFields = [...currentFields]

      newFields.splice(
        index + 1,
        0,
        duplicate
      )

      return newFields
    })
  }

  function handleFieldChange(updatedField) {
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === updatedField.id
          ? updatedField
          : field
      )
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

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col">

      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b">

        <div className="flex items-center gap-4">

          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link to="/forms">
              <ArrowLeft />
            </Link>
          </Button>

          <div>
            <h1 className="font-semibold">
              New Form
            </h1>

            <p className="text-xs text-muted-foreground">
              Form Builder
            </p>
          </div>

        </div>

        <Button>
          <Save />
          Save Form
        </Button>

      </header>

      {/* Builder */}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >

        <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_280px]">

          {/* Field Palette */}
          <aside className="min-w-0 overflow-x-hidden overflow-y-auto border-r p-4">

            <h2 className="mb-4 text-sm font-semibold">
              Fields
            </h2>

            <FieldPalette />

          </aside>

          {/* Canvas */}
          <main className="min-w-0 overflow-y-auto bg-muted/30 p-8">

            <div className="mx-auto min-h-full max-w-2xl">

              <div className="rounded-xl border bg-background p-8 shadow-sm">

                <h2 className="text-2xl font-bold">
                  Untitled Form
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Build your form below.
                </p>

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
          <aside className="min-w-0 overflow-x-hidden overflow-y-auto border-l p-4">

            <h2 className="text-sm font-semibold">
              Properties
            </h2>

            <FieldProperties
              field={selectedField}
              onChange={handleFieldChange}
            />

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