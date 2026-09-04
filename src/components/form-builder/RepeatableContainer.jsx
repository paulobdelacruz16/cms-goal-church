import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {
  useDroppable,
  useDndContext,
} from '@dnd-kit/core'

import SortableField from './SortableField'

function RepeatableContainer({
  field,
  selectedFieldId,
  onFieldSelect,
  onDelete,
  onDuplicate,
}) {
  const { setNodeRef } = useDroppable({
    id: `repeatable-${field.id}`,
    data: {
      type: 'repeatable-container',
      fieldId: field.id,
    },
  })

  const { active, over } = useDndContext()

  const isDraggingPaletteField =
    active?.data.current?.type ===
    'palette-field'

  /*
   * The entire Repeatable should highlight
   * while dragging a NEW field from the palette
   * anywhere inside the container.
   */
  const isHighlighted =
    isDraggingPaletteField &&
    over?.id ===
      `repeatable-${field.id}`

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-lg border-2 p-2 md:p-4
        transition-all
        ${isHighlighted
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-dashed'
        }
      `}
    >

      {/* Container header */}
      <div>
        <h3 className="font-medium">
          {field.label}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Repeatable Container
        </p>
      </div>

      {/* Nested fields */}
      <div className="mt-4">

        {field.fields?.length > 0 ? (
          <SortableContext
            items={field.fields.map(
              (nestedField) =>
                nestedField.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <div
              className="space-y-3"
              onPointerDown={(event) =>
                event.stopPropagation()
              }
            >

              {field.fields.map(
                (nestedField) => (
                  <SortableField
                    key={nestedField.id}
                    field={nestedField}
                    parentId={field.id}
                    selected={
                      nestedField.id ===
                      selectedFieldId
                    }
                    selectedFieldId={
                      selectedFieldId
                    }
                    onSelect={
                      onFieldSelect
                    }
                    onDelete={
                      onDelete
                    }
                    onDuplicate={
                      onDuplicate
                    }
                  />
                )
              )}
            </div>
          </SortableContext>
        ) : (
          <div className="flex min-h-24 items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop fields here
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Drag fields from the left panel.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Drop indicator */}
      {isHighlighted && (
        <div className="mt-4 rounded-md border border-primary/50 bg-primary/5 py-2 text-center text-xs font-medium text-primary">
          Drop field into this container
        </div>
      )}

    </div>
  )
}

export default RepeatableContainer
