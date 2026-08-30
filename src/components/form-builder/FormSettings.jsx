import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function FormSettings({
  formDescription,
  submitButtonText,
  successMessage,
  onFormDescriptionChange,
  onSubmitButtonTextChange,
  onSuccessMessageChange,
}) {
  return (
    <div className="mt-6 space-y-6">

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="form-description">
          Description
        </Label>

        <Textarea
          id="form-description"
          value={formDescription}
          onChange={(event) =>
            onFormDescriptionChange(
              event.target.value
            )
          }
          rows={4}
          placeholder="Build your form below."
        />
      </div>

      {/* Submit Button Text */}
      <div className="space-y-2">
        <Label htmlFor="submit-button-text">
          Submit Button Text
        </Label>

        <Input
          id="submit-button-text"
          value={submitButtonText}
          onChange={(event) =>
            onSubmitButtonTextChange(
              event.target.value
            )
          }
          placeholder="Submit"
        />
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <Label htmlFor="success-message">
          Success Message
        </Label>

        <Textarea
          id="success-message"
          value={successMessage}
          onChange={(event) =>
            onSuccessMessageChange(
              event.target.value
            )
          }
          rows={4}
          placeholder="Thank you! Your response has been submitted."
        />
      </div>

    </div>
  )
}

export default FormSettings