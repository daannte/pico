"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input, PasswordInput, PrefixInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setFormData, formData, login } = useJellyfin()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setFormData({
      serverUrl: "",
      username: "",
      password: "",
    });
  }, [setFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value.replace(/\s+/g, ""),
    })

    setError('')
  }

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      await login()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Welcome to Pico</h1>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <div>
                <Label htmlFor="serverUrl" className="text-sm font-medium">
                  Server URL
                </Label>
                <PrefixInput
                  name="serverUrl"
                  value={formData.serverUrl}
                  onChange={handleInputChange}
                  placeholder="your-jellyfin-server.com"
                />
              </div>
              <div>
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Demo server: demo.jellyfin.org/stable with username "demo"
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
