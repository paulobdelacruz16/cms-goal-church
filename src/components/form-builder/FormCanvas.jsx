import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { useDroppable } from '@dnd-kit/core'

import SortableField from './SortableField'

function FormCanvas({ fields }) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: 'form-canvas',
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-96 rounded-lg border-2 border-dashed p-4
        transition
        ${isOver ? 'border-primary bg-primary/5' : ''}
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
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {fields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  )
}

export default FormCanvas