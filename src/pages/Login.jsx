import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAuthSession, login } from '@/api/auth'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (getAuthSession()) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(username.trim(), password)
      const destination =
        location.state?.from?.pathname || '/'

      navigate(destination, { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">
          Login
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your forms.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login