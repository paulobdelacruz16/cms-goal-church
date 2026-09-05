export const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  IMAGE: 'image',
  REPEATABLE: 'repeatable',
  GROUP: 'group',
}

export const FIELD_DEFINITIONS = [
  {
    type: FIELD_TYPES.TEXT,
    label: 'Text',
  },
  {
    type: FIELD_TYPES.TEXTAREA,
    label: 'Textarea',
  },
  {
    type: FIELD_TYPES.SELECT,
    label: 'Select',
  },
  {
    type: FIELD_TYPES.RADIO,
    label: 'Radio',
  },
  {
    type: FIELD_TYPES.CHECKBOX,
    label: 'Checkbox',
  },
  {
    type: FIELD_TYPES.IMAGE,
    label: 'Image',
  },
  {
    type: FIELD_TYPES.REPEATABLE,
    label: 'Repeatable',
  },
  {
    type: FIELD_TYPES.GROUP,
    label: 'Group',
  },
]

export function createField(type) {
  const id = `field_${crypto.randomUUID()}`

  if (
    type === FIELD_TYPES.REPEATABLE ||
    type === FIELD_TYPES.GROUP
  ) {
    return {
      id,
      type,
      name: `${type}_${Date.now()}`,
      label:
        type === FIELD_TYPES.GROUP
          ? 'Group Container'
          : 'Repeatable Container',
      fields: [],
    }
  }

  const defaults = {
    id,
    type,
    name: `${type}_${Date.now()}`,
    label: getDefaultLabel(type),
    required: false,
    placeholder: '',
  }

  if (
    type === FIELD_TYPES.SELECT ||
    type === FIELD_TYPES.RADIO
  ) {
    return {
      ...defaults,
      options: [
        {
          label: 'Option 1',
          value: 'option-1',
        },
        {
          label: 'Option 2',
          value: 'option-2',
        },
      ],
    }
  }

  if (type === FIELD_TYPES.CHECKBOX) {
    return {
      ...defaults,
      checked: false,
    }
  }

  if (type === FIELD_TYPES.IMAGE) {
    return {
      ...defaults,
      imageUrl: '',
    }
  }

  return defaults
}

function getDefaultLabel(type) {
  const definition = FIELD_DEFINITIONS.find(
    (field) => field.type === type
  )

  return definition?.label || 'Field'
}
