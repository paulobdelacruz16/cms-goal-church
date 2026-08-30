function FieldRenderer({ field }) {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          placeholder={field.placeholder || ''}
          className="w-full rounded-md border px-3 py-2"
        />
      )

    case 'email':
      return (
        <input
          type="email"
          placeholder={field.placeholder || ''}
          className="w-full rounded-md border px-3 py-2"
        />
      )

    case 'number':
      return (
        <input
          type="number"
          placeholder={field.placeholder || ''}
          className="w-full rounded-md border px-3 py-2"
        />
      )

    case 'textarea':
      return (
        <textarea
          placeholder={field.placeholder || ''}
          className="min-h-24 w-full rounded-md border px-3 py-2"
        />
      )

    case 'date':
      return (
        <input
          type="date"
          className="w-full rounded-md border px-3 py-2"
        />
      )

    default:
      return null
  }
}

export default FieldRenderer