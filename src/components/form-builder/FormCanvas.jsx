import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {
  useDroppable,
  useDndContext,
} from '@dnd-kit/core'

import SortableField from './SortableField'

function FormCanvas({
  fields,
  selectedFieldId,
  onFieldSelect,
  onDelete,
  onDuplicate,
}) {
  const { setNodeRef } = useDroppable({
    id: 'form-canvas',
  })

  const { active } = useDndContext()

  const isDraggingPaletteField =
    active?.data.current?.type ===
    'palette-field'

  /*
   * Highlight the entire canvas only when
   * dragging a NEW field from the palette.
   *
   * Existing sortable fields should never
   * trigger the canvas highlight.
   */
  const isCanvasDrop =
    isDraggingPaletteField

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-96 rounded-lg border-2 border-dashed p-4
        transition
        ${
          isCanvasDrop
            ? 'border-primary bg-primary/5'
            : ''
        }
      `}
    >

      {fields.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center">
          <div className="text-center">
            <p className="font-medium">
              Drop fields here
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Drag a field from the left panel.
            </p>
          </div>
        </div>
      ) : (
        <SortableContext
          items={fields.map(
            (field) => field.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >

          <div className="flex min-h-80 flex-col">

            {/* Fields */}
            <div className="space-y-4">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  selected={
                    field.id ===
                    selectedFieldId
                  }
                  onSelect={onFieldSelect}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                />
              ))}
            </div>

            {/* Empty space / drop area */}
            <div className="flex min-h-32 flex-1 items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm font-medium">
                  Drop fields here
                </p>

                <p className="mt-1 text-xs">
                  Drag another field from the left panel.
                </p>
              </div>
            </div>

          </div>

        </SortableContext>
      )}

    </div>
  )
}

export default FormCanvas