import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DndContext } from '@dnd-kit/core'

import { Button } from '@/components/ui/button'

import { createField } from '@/lib/form-fields'

import FieldPalette from '@/components/form-builder/FieldPalette'
import FormCanvas from '@/components/form-builder/FormCanvas'

function FormBuilder() {
  const [fields, setFields] = useState([])

  function handleDragEnd(event) {
    const { active, over } = event

    if (!over) {
      return
    }

    if (over.id !== 'form-canvas') {
      return
    }

    const fieldType = active.data.current?.fieldType

    if (!fieldType) {
      return
    }

    const newField = createField(fieldType)

    setFields((currentFields) => [
      ...currentFields,
      newField,
    ])
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
      <DndContext onDragEnd={handleDragEnd}>

        <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_280px]">

          {/* Field Palette */}
          <aside className="overflow-y-auto border-r p-4">

            <h2 className="mb-4 text-sm font-semibold">
              Fields
            </h2>

            <FieldPalette />

          </aside>

          {/* Canvas */}
          <main className="overflow-y-auto bg-muted/30 p-8">

            <div className="mx-auto min-h-full max-w-2xl">

              <div className="rounded-xl border bg-background p-8 shadow-sm">

                <h2 className="text-2xl font-bold">
                  Untitled Form
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Build your form below.
                </p>

                <div className="mt-8">
                  <FormCanvas fields={fields} />
                </div>

              </div>

            </div>

          </main>

          {/* Properties */}
          <aside className="overflow-y-auto border-l p-4">

            <h2 className="text-sm font-semibold">
              Properties
            </h2>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Select a field to edit its properties.
            </div>

          </aside>

        </div>

      </DndContext>

    </div>
  )
}

export default FormBuilder