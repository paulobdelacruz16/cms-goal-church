import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableField({
  field,
  selected,
  onSelect,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(field.id)}
      className={`
    rounded-lg border bg-background
    transition
    ${selected ? 'border-primary ring-2 ring-primary/20' : ''}
  `}
    >
      <div className="flex items-center gap-3 p-4">

        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Move ${field.label}`}
        >
          ☰
        </button>

        <div className="flex-1">
          <p className="font-medium">
            {field.label}
          </p>

          <p className="text-xs text-muted-foreground">
            {field.type}
          </p>
        </div>

      </div>
    </div>
  )
}

export default SortableField