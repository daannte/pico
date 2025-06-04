"use client"

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { jellyfinClient } from '@/lib/jellyfin';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, PrefixInput, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function Login() {
  const router = useRouter()
  const { setIsAuthenticated, setFormData, formData } = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await jellyfinClient.authenticate(formData);
      setIsAuthenticated(true);
      router.replace("/")
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Connect to Jellyfin
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Enter your server details to get started
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <PrefixInput
                label="Server URL"
                name="serverUrl"
                type="url"
                value={formData.serverUrl}
                onChange={handleInputChange}
                placeholder="your-jellyfin-server.com"
              />
            </div>

            <div className="space-y-2">
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

            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Demo server: demo.jellyfin.org/stable with username "demo"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
