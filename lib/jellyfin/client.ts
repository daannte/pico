import { Jellyfin, Api } from '@jellyfin/sdk'
import { AuthenticationResult } from "@jellyfin/sdk/lib/generated-client/models"

export interface JellyfinConfig {
  serverUrl: string
  username: string
  password: string
}

class JellyfinClient {
  private jellyfin: Jellyfin
  private api: Api | null = null
  private authResult: AuthenticationResult | null = null

  constructor() {
    this.jellyfin = new Jellyfin({
      clientInfo: { name: 'Pico', version: '0.1.0' },
      deviceInfo: { name: 'Web Client', id: 'pico-client-web' },
    })
  }

  async authenticate(config: JellyfinConfig): Promise<AuthenticationResult> {
    this.api = this.jellyfin.createApi(`https://${config.serverUrl}`)

    try {
      const result = await this.api.authenticateUserByName(config.username, config.password)
      this.authResult = result.data
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

  getAuthResult(): AuthenticationResult {
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
