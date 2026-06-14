import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BrowserStorageService } from './browser-storage.service';
import { GoogleDriveFile } from './../util/models';
import { map } from 'rxjs/operators';

declare const google: any; // Declares the GIS SDK global variable

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  private readonly CLIENT_ID = '508987750835-k2slqr9rk4uik5o821c34s21ra4e7nv9.apps.googleusercontent.com';
  private readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive';

  private tokenClient: any;
  private authStatus$ = new Subject<boolean>();

  constructor(private http: HttpClient,
              private browserStorageService: BrowserStorageService) {
    this.initTokenClient();
  }

  // Initialize the OAuth client
  private initTokenClient() {
    // Wait for the script to load if necessary
    setTimeout(() => {
      if (typeof google !== 'undefined') {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
          callback: (response: any) => {
            if (response.error !== undefined) {
              throw response;
            }
            this.browserStorageService.setGoogleAccessToken(response.access_token);
            this.authStatus$.next(true);
          },
        });
      }
    }, 1000);
  }

  // Trigger OAuth login popup
  public login() {
    if (this.tokenClient) {
      // Prompt user to select account and grant permissions
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  }

  private tickleAccessToken() {
    if (this.tokenClient) {
      //this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  public logout() {
    var accessToken = this.browserStorageService.getGoogleAccessToken();
    this.browserStorageService.clearGoogleAccessToken();
    if (typeof google !== "undefined") {
      google.accounts.oauth2.revoke(accessToken, () => {
        this.authStatus$.next(false);
      });
    }
    else {
      this.authStatus$.next(false);
    }
  }

  public getAuthStatus(): Observable<boolean> {
    this.tickleAccessToken();
    return this.authStatus$.asObservable();
  }

  public listFiles(folderId: string): Observable<GoogleDriveFile[]> {
    // Call the Google Drive v3 files endpoint
    this.tickleAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.browserStorageService.getGoogleAccessToken()}`,
    });
    const params = {
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType)'
    };
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files', { headers, params })
      .pipe(map((response) => {
        return response.files;
      }));
  }

  public loadImageUrl(file: GoogleDriveFile): Observable<string> {
    this.tickleAccessToken();
    const myHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.browserStorageService.getGoogleAccessToken()}`,
    });
    const params = {
      alt: 'media',
    };
    return this.http.get(`https://www.googleapis.com/drive/v3/files/${file.id}`,
      {
        headers: myHeaders,
        params: params,
        responseType: 'blob' as const
      })
      .pipe(map(blob => URL.createObjectURL(blob)));
  }

  public createFolder(parentId: string, name: string): Observable<GoogleDriveFile> {
    this.tickleAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.browserStorageService.getGoogleAccessToken()}`,
    });
    const body = {
      name: name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    };
    return this.http.post<any>('https://www.googleapis.com/drive/v3/files',
      body,
      {
        headers,
      })
      .pipe(map((response) => {
        return {
          id: response.id,
          name: response.name,
          mimeType: response.mimeType
        };
      }));
  }
}
