import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  Type,
  AlignLeft,
  List,
  CircleDot,
  CheckSquare,
  CalendarDays,
  LayoutGrid 
} from 'lucide-react'

const FIELD_ICONS = {
  text: Type,
  textarea: AlignLeft,
  select: List,
  radio: CircleDot,
  checkbox: CheckSquare,
  date: CalendarDays,
  repeatable: LayoutGrid,
}

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
  console.log(field.type);
  const Icon = FIELD_ICONS[field.type]

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
      className="flex cursor-grab items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted active:cursor-grabbing"
    >
      {Icon && (
        <Icon
          className={`h-4 w-4 shrink-0 text-blue-600`}
        />
      )}

      <span>{field.label}</span>
    </div>
  )
}

export default DraggableField