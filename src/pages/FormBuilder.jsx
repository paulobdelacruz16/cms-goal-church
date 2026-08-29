import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function FormBuilder() {
  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col">

      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b">

        <div className="flex items-center gap-4">

          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link to="/forms">
              <ArrowLeft />
            </Link>
          </Button>

          <div>
            <h1 className="font-semibold">
              New Form
            </h1>

            <p className="text-xs text-muted-foreground">
              Form Builder
            </p>
          </div>

        </div>

        <Button>
          <Save />
          Save Form
        </Button>

      </header>

      {/* Builder */}
      <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_280px]">

        {/* Field Palette */}
        <aside className="overflow-y-auto border-r p-4">

          <h2 className="mb-4 text-sm font-semibold">
            Fields
          </h2>

          <div className="space-y-2">

            <div className="rounded-lg border p-3">
              Text
            </div>

            <div className="rounded-lg border p-3">
              Email
            </div>

            <div className="rounded-lg border p-3">
              Number
            </div>

            <div className="rounded-lg border p-3">
              Textarea
            </div>

            <div className="rounded-lg border p-3">
              Checkbox
            </div>

            <div className="rounded-lg border p-3">
              Select
            </div>

          </div>

        </aside>

        {/* Canvas */}
        <main className="overflow-y-auto bg-muted/30 p-8">

          <div className="mx-auto min-h-full max-w-2xl">

            <div className="rounded-xl border bg-background p-8 shadow-sm">

              <h2 className="text-2xl font-bold">
                Untitled Form
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Drag fields here to build your form.
              </p>

              {/* Drop area */}
              <div className="mt-8 flex min-h-96 items-center justify-center rounded-lg border-2 border-dashed">

                <div className="text-center">

                  <p className="font-medium">
                    Drop fields here
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Drag a field from the left panel.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </main>

        {/* Properties */}
        <aside className="overflow-y-auto border-l p-4">

          <h2 className="text-sm font-semibold">
            Properties
          </h2>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Select a field to edit its properties.
          </div>

        </aside>

      </div>

    </div>
  )
}

export default FormBuilder