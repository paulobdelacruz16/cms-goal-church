import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHome, createHome } from '@/api/home'
import { Button } from '@/components/ui/button'

function Dashboard() {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['home'],
    queryFn: getHome,
  })

  const createMutation = useMutation({
    mutationFn: createHome,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['home'],
      })
    },
  })

  function handleCreate() {
    createMutation.mutate(
      {
        "section1":
        {
          "card": [
            { "title": "Lorem ipsum", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "https://www.youtube.com/embed/WsT_Exuo79M" },
            { "title": "Lorem ipsum", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "https://www.youtube.com/embed/WsT_Exuo79M" },
            { "title": "Lorem ipsum", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "https://www.youtube.com/embed/WsT_Exuo79M" }
          ]
        },
        "section2": { "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
        "section3": {
          "title": "Lorem ipsum ", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "card": [
            { "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "/sermon" },
            { "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "/sermon" }, { "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "/sermon" }]
        },
        "section4": {
          "title": "Lorem ipsum", "description": "Lorem ipsum", "card": [
            { "title": "Lorem ipsum", "author": "Lorem ipsum", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "https://www.youtube.com/embed/WsT_Exuo79M" },
            { "title": "Lorem ipsum", "author": "Lorem ipsum", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "https://www.youtube.com/embed/WsT_Exuo79M" },
            { "title": "Lorem ipsum", "author": "Lorem ipsum", "image": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg", "url": "https://www.youtube.com/embed/WsT_Exuo79M" }]
        },
        "section5": {
          "card": [
            { "verse": "1 Timothy 6:12", "description": "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." },
            { "verse": "Philippians 4:7", "description": "For we live by faith, not by sight" },
            { "verse": "1 Timothy 6:12", "description": "Fight the good fight of the faith. Take hold of the eternal life to which you were called when you made your good confession in the presence of many witnesses." }
          ]
        },
        "section6": {
          "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "card": [
            { "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "url": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg" },
            { "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "url": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg" },
            { "title": "Lorem ipsum", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "url": "https://raw.githubusercontent.com/paulobdelacruz16/images/refs/heads/main/605024630_1160982632855503_2466021383668000625_n.jpg" }
          ]
        }
      }
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          API connection test
        </p>
      </div>

      <Button
        onClick={handleCreate}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending
          ? 'Saving...'
          : 'Create Test Data'}
      </Button>

      {createMutation.isError && (
        <p className="text-red-500">
          {createMutation.error.message}
        </p>
      )}

      {createMutation.isSuccess && (
        <p className="text-green-600">
          Data created successfully!
        </p>
      )}

      <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>

    </div>
  )
}

export default Dashboard