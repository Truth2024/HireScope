import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';

type DropboxTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

type DropboxError = {
  error: string;
  error_description?: string;
};

class DropboxService {
  private dbx: Dropbox | null = null;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = process.env.POSTMAN_REFRESH;
    const appKey = process.env.POSTMAN_APP_KEY;
    const appSecret = process.env.POSTMAN_APP_SECRET;

    if (!refreshToken || !appKey || !appSecret) {
      throw new Error('Dropbox credentials not configured');
    }

    try {
      const response = await fetch('https://api.dropbox.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: appKey,
          client_secret: appSecret,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as DropboxError;
        throw new Error(
          `Failed to refresh Dropbox token: ${errorData.error_description || errorData.error}`
        );
      }

      const data = (await response.json()) as DropboxTokenResponse;
      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + (data.expires_in || 14400) * 1000;

      this.dbx = new Dropbox({
        accessToken: this.accessToken,
        fetch: fetch,
      });

      return this.accessToken;
    } catch (error) {
      throw new Error(
        `Dropbox authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async ensureInitialized(): Promise<Dropbox> {
    if (
      !this.dbx ||
      !this.accessToken ||
      (this.tokenExpiresAt && Date.now() >= this.tokenExpiresAt)
    ) {
      await this.refreshAccessToken();
    }

    if (!this.dbx) {
      throw new Error('Dropbox client not initialized');
    }

    return this.dbx;
  }

  async uploadFile(buffer: Buffer, path: string): Promise<string> {
    const dbx = await this.ensureInitialized();

    try {
      const response = await dbx.filesUpload({
        path,
        contents: buffer,
        mode: { '.tag': 'overwrite' },
      });

      const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({
        path: response.result.path_display!,
        settings: {
          requested_visibility: { '.tag': 'public' },
        },
      });

      const url = sharedLink.result.url
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace('?dl=0', '');

      return url;
    } catch (error) {
      throw new Error(
        `Failed to upload file to Dropbox: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteFile(path: string): Promise<void> {
    const dbx = await this.ensureInitialized();

    try {
      await dbx.filesDeleteV2({ path });
    } catch {
      return;
    }
  }

  generateFilePath(userId: string, fileName: string): string {
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');
    return `/Приложения/hirescope/avatars/${userId}/${cleanFileName}`;
  }
}

export const dropboxService = new DropboxService();
