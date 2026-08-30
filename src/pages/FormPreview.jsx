import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getDynamicPageContentById } from '@/api/dynamicPageContent'

function FormPreview() {
  const { id } = useParams()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true)
        setError(null)

        const data =
          await getDynamicPageContentById(id)

        setForm(data)
      } catch (error) {
        console.error(
          'Failed to load form:',
          error
        )

        setError(
          'Failed to load form.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadForm()
    }
  }, [id])

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">
          Loading form...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive">
          {error}
        </p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">
          Form not found.
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        {form.name}
      </h1>

      <p className="mt-2 text-muted-foreground">
        Form Preview
      </p>
    </div>
  )
}

export default FormPreview