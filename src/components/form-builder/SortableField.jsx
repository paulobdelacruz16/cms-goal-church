import { Copy, GripVertical, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import FormFieldRenderer from './FormFieldRenderer'
import RepeatableContainer from './RepeatableContainer'

function SortableField({
  field,
  selected,
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
      onClick={() => onSelect(field.id)}
      className={`
        rounded-lg border bg-background
        transition
        ${selected
          ? 'border-primary ring-2 ring-primary/20'
          : ''
        }
      `}
    >
      <div className="flex items-start gap-3 p-4">

        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) =>
            event.stopPropagation()
          }
          className="mt-2 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Move ${field.label}`}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Field */}
        <div className="min-w-0 flex-1">

          {isRepeatable ? (
            <RepeatableContainer
              field={field}
              selectedFieldId={field.id}
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
        <div className="flex shrink-0 gap-1">

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDuplicate(field.id)
            }}
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