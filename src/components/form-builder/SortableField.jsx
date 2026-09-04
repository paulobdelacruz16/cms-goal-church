import { Copy, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import FormFieldRenderer from './FormFieldRenderer'
import RepeatableContainer from './RepeatableContainer'

function SortableField({
  field,
  selected,
  selectedFieldId,
  onSelect,
  onDelete,
  onDuplicate,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isRepeatable =
    field.type === 'repeatable'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(field.id)
      }}
      className={`
        cursor-grab rounded-lg border bg-background active:cursor-grabbing
        transition
        ${selected
          ? 'border-primary ring-2 ring-primary/20'
          : ''
        }
      `}
    >
      <div className="flex flex-col gap-3 p-2 md:p-4 md:flex-row md:items-start">

        {/* Field */}
        <div className="min-w-0 flex-1">

          {isRepeatable ? (
            <RepeatableContainer
              field={field}
              selectedFieldId={selectedFieldId}
              onFieldSelect={onSelect}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ) : (
            <FormFieldRenderer
              field={field}
            />
          )}

        </div>

        {/* Actions */}
        <div className="order-first flex shrink-0 gap-1 md:order-none">

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
    </div>
  )
}

export default SortableField
