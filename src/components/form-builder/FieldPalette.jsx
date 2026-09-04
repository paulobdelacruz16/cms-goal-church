import { FIELD_DEFINITIONS } from '@/lib/form-fields'
import DraggableField from './DraggableField'

function FieldPalette() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
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
