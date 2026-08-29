import { useDroppable } from '@dnd-kit/core'

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
        <div className="space-y-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="rounded-lg border bg-background p-4"
            >
              <p className="font-medium">
                {field.label}
              </p>

              <p className="text-xs text-muted-foreground">
                {field.type}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FormCanvas