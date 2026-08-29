export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
}

export const FIELD_DEFINITIONS = [
  {
    type: FIELD_TYPES.TEXT,
    label: 'Text',
  },
  {
    type: FIELD_TYPES.EMAIL,
    label: 'Email',
  },
  {
    type: FIELD_TYPES.NUMBER,
    label: 'Number',
  },
  {
    type: FIELD_TYPES.TEXTAREA,
    label: 'Textarea',
  },
  {
    type: FIELD_TYPES.CHECKBOX,
    label: 'Checkbox',
  },
  {
    type: FIELD_TYPES.SELECT,
    label: 'Select',
  },
];

export function createField(type) {
  const id = `field_${crypto.randomUUID()}`

  const defaults = {
    id,
    type,
    name: `${type}_${Date.now()}`,
    label: getDefaultLabel(type),
    required: false,
    placeholder: '',
  }

  if (type === FIELD_TYPES.SELECT) {
    defaults.options = [
      {
        label: 'Option 1',
        value: 'option_1',
      },
      {
        label: 'Option 2',
        value: 'option_2',
      },
    ]
  }

  if (type === FIELD_TYPES.TEXTAREA) {
    defaults.placeholder = ''
  }

  return defaults
}

function getDefaultLabel(type) {
  const definition = FIELD_DEFINITIONS.find(
    (field) => field.type === type
  )

  return definition?.label || 'Field'
}