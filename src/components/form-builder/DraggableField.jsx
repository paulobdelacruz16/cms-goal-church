import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  Type,
  AlignLeft,
  List,
  CircleDot,
  CheckSquare,
  CalendarDays,
  LayoutGrid,
  ImageIcon
} from 'lucide-react'

const FIELD_ICONS = {
  text: Type,
  textarea: AlignLeft,
  select: List,
  radio: CircleDot,
  checkbox: CheckSquare,
  date: CalendarDays,
  repeatable: LayoutGrid,
  group: LayoutGrid,
  image: ImageIcon,
}

function DraggableField({ field, onClickAdd }) {
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

  if (isDragging) {
    return null
  }

  const Icon = FIELD_ICONS[field.type]

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClickAdd?.(field.type)}
      className="flex cursor-grab min-w-0 flex-1 basis-[calc(50%-0.25rem)] items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted sm:basis-auto sm:flex-none active:cursor-grabbing"
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