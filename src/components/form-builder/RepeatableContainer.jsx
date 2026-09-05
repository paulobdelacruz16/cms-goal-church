import { Copy, Trash2 } from 'lucide-react'

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
  const isGroup = field.type === 'group'
  const containerType =
    isGroup ? 'group-container' : 'repeatable-container'

  const { setNodeRef } = useDroppable({
    id: `${field.type}-${field.id}`,
    data: {
      type: containerType,
      fieldId: field.id,
    },
  })

  const { active, over } = useDndContext()

  const isDraggingPaletteField =
    active?.data.current?.type ===
    'palette-field'

  const isHighlighted =
    isDraggingPaletteField &&
    over?.id === `${field.type}-${field.id}`

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-lg p-2 md:p-4 transition-all
        ${isHighlighted
          ? 'border-2 border-dashed border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border border-transparent bg-transparent'
        }
      `}
    >

      {/* Container header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">
            {field.label}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {isGroup ? 'Group Container' : 'Repeatable Container'}
          </p>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDuplicate(field.id)
            }}
            onPointerDown={(event) =>
              event.stopPropagation()
            }
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Duplicate ${field.label}`}
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(field.id)
            }}
            onPointerDown={(event) =>
              event.stopPropagation()
            }
            className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete ${field.label}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Nested fields */}
      <div className="mt-4 w-full">

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
              className="w-full space-y-3"
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
          <div className="flex min-h-10 items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/10 py-3">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Drop fields here
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
