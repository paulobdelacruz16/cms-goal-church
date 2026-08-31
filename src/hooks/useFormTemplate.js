import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getFormTemplate,
  getFormTemplateById,
  createFormTemplate,
  updateFormTemplate,
  deleteFormTemplate,
} from '@/api/formtemplate'

export function useFormTemplate() {
  return useQuery({
    queryKey: ['formtemplate'],
    queryFn: getFormTemplate,
  })
}

export function useFormTemplateById(id) {
  return useQuery({
    queryKey: ['formtemplate', id],
    queryFn: () => getFormTemplateById(id),
    enabled: Boolean(id),
  })
}

export function useCreateFormTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFormTemplate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['formtemplate'],
      })
    },
  })
}

export function useUpdateFormTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateFormTemplate(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['formtemplate'],
      })

      queryClient.invalidateQueries({
        queryKey: [
          'formtemplate',
          variables.id,
        ],
      })
    },
  })
}

export function useDeleteFormTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFormTemplate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['formtemplate'],
      })
    },
  })
}