"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, PrefixInput, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

import { jellyfinClient, AuthResult } from '@/lib/jellyfin';

export default function JellyfinLoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthResult | null>(null);
  const [formData, setFormData] = useState({
    serverUrl: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsAuthenticated(jellyfinClient.isAuthenticated());
  }, []);

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
      const result = await jellyfinClient.authenticate(formData);
      setAuthData(result);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthData(null);
    setFormData({
      serverUrl: '',
      username: '',
      password: ''
    });
  };

  if (isAuthenticated && authData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              ✓ Connected to Jellyfin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-600">Server:</span>
                <p className="text-gray-800 break-all">{formData.serverUrl}</p>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-600">User:</span>
                <p className="text-gray-800">{formData.username}</p>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-600">Access Token:</span>
                <p className="text-gray-800 font-mono text-xs break-all bg-white p-2 rounded border">
                  {authData.accessToken}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
