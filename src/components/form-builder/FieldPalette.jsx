import { FIELD_DEFINITIONS } from '@/lib/form-fields'
import DraggableField from './DraggableField'

function FieldPalette({ onAddField }) {
  return (
    <div className="flex w-full flex-wrap gap-2 lg:justify-center">
      {FIELD_DEFINITIONS.map((field) => (
        <DraggableField
          key={field.type}
          field={field}
          onClickAdd={onAddField}
        />
      ))}
    </div>
  )
}

export default FieldPalette
