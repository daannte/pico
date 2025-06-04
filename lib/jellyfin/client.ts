import { Jellyfin, Api } from '@jellyfin/sdk'

export interface JellyfinConfig {
  serverUrl: string
  username: string
  password: string
}

export interface AuthResult {
  accessToken: string
  userId: string
  serverUrl: string
}

class JellyfinClient {
  private jellyfin: Jellyfin
  private api: Api | null = null
  private authResult: AuthResult | null = null

  constructor() {
    this.jellyfin = new Jellyfin({
      clientInfo: { name: 'Pico', version: '0.1.0' },
      deviceInfo: { name: 'Web Client', id: 'pico-client-web' },
    })
  }

  async authenticate(config: JellyfinConfig): Promise<AuthResult> {
    this.api = this.jellyfin.createApi(`https://${config.serverUrl}`)

    try {
      const result = await this.api.authenticateUserByName(config.username, config.password)

      this.authResult = {
        accessToken: result.data.AccessToken!,
        userId: result.data.User?.Id!,
        serverUrl: config.serverUrl,
      }

      return this.authResult
    } catch (err: any) {
      throw new Error('Authentication failed: ' + err.message)
    }
  }

  getApi(): Api {
    if (!this.api) {
      throw new Error('Not authenticated. Call authenticate() first.')
    }
    return this.api
  }

  getAuthResult(): AuthResult {
    if (!this.authResult) {
      throw new Error('Not authenticated. Call authenticate() first.')
    }
    return this.authResult
  }

  isAuthenticated(): boolean {
    return this.api !== null && this.authResult !== null
  }
}

export const jellyfinClient = new JellyfinClient()
