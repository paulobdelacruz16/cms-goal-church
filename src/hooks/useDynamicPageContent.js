import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getDynamicPageContent,
  getDynamicPageContentById,
  createDynamicPageContent,
  updateDynamicPageContent,
  deleteDynamicPageContent,
} from '@/api/dynamicPageContent'

export function useDynamicPageContent() {
  return useQuery({
    queryKey: ['dynamicPageContent'],
    queryFn: getDynamicPageContent,
  })
}

export function useDynamicPageContentById(id) {
  return useQuery({
    queryKey: ['dynamicPageContent', id],
    queryFn: () => getDynamicPageContentById(id),
    enabled: Boolean(id),
  })
}

export function useCreateDynamicPageContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDynamicPageContent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dynamicPageContent'],
      })
    },
  })
}

export function useUpdateDynamicPageContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateDynamicPageContent(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['dynamicPageContent'],
      })

      queryClient.invalidateQueries({
        queryKey: [
          'dynamicPageContent',
          variables.id,
        ],
      })
    },
  })
}

export function useDeleteDynamicPageContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDynamicPageContent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dynamicPageContent'],
      })
    },
  })
}