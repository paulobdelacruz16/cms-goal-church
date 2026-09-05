import { FIELD_DEFINITIONS } from '@/lib/form-fields'
import DraggableField from './DraggableField'

function FieldPalette() {
  return (
    <div className="flex w-full flex-wrap gap-2 lg:justify-center">
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
