import { FIELD_DEFINITIONS } from '@/lib/form-fields'
import DraggableField from './DraggableField'

function FieldPalette() {
  return (
    <div className="grid grid-cols-2 gap-2 md:block md:space-y-2">
      {FIELD_DEFINITIONS.map((field) => (
        <DraggableField
          key={field.type}
          field={field}
        />
      ))}
    </div>
  )
}

export default FieldPalette
