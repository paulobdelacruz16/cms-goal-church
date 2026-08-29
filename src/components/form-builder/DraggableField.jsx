import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

function DraggableField({ field }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `palette-${field.type}`,
    data: {
      type: 'palette-field',
      fieldType: field.type,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg border bg-background p-3 text-sm font-medium transition hover:bg-muted active:cursor-grabbing"
    >
      {field.label}
    </div>
  )
}

export default DraggableField