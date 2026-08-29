import { useQuery } from '@tanstack/react-query'
import { getHome } from '@/api/home'

function Dashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['home'],
    queryFn: getHome,
  })

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
    <div className="space-y-4">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <pre className="rounded-lg bg-gray-100 p-4">
        {JSON.stringify(data, null, 2)}
      </pre>

    </div>
  )
}

export default Dashboard